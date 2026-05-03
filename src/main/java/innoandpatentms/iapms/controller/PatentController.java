package innoandpatentms.iapms.controller;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.Principal;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import innoandpatentms.iapms.entity.Committee;
import innoandpatentms.iapms.entity.Patent;
import innoandpatentms.iapms.entity.Status;
import innoandpatentms.iapms.entity.User;
import innoandpatentms.iapms.repository.CommitteeRepository;
import innoandpatentms.iapms.repository.PatentRepository;
import innoandpatentms.iapms.repository.UserRepository;
import innoandpatentms.iapms.service.NotificationService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@RestController
@RequestMapping("/api/v1.0/patents")
@RequiredArgsConstructor
public class PatentController {

    private final PatentRepository patentRepository;
    private final UserRepository userRepository;
    private final CommitteeRepository committeeRepository;
    private final NotificationService notificationService;

    // Define where files are stored locally
    private final String UPLOAD_DIR = "C:/iapms_system/uploads/";

    // ==========================================
    // 1. ACCESS & SEARCH
    // ==========================================

    @GetMapping
    public ResponseEntity<?> getAll(Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ADMINs see everything; Users see their own submissions
        if (user.getRoles().contains("ADMIN")) {
            return ResponseEntity.ok(patentRepository.findAll());
        }
        return ResponseEntity.ok(patentRepository.findByUser(user));
    }

    @GetMapping("/review-list")
    public ResponseEntity<?> getMyReviewList(Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Get patents assigned to committees this user belongs to
        List<Committee> myCommittees = committeeRepository.findByMembersContaining(user);
        return ResponseEntity.ok(patentRepository.findByAssignedCommitteeIn(myCommittees));
    }

    // ==========================================
    // 2. SUBMISSION & EDITING
    // ==========================================

    @PostMapping(value = "/submit/{committeeId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Transactional
    public ResponseEntity<?> submit(
            @PathVariable Long committeeId,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("category") String category,
            @RequestParam("file") MultipartFile file,
            Principal principal) {

        try {
            User user = userRepository.findByEmail(principal.getName()).orElseThrow();
            Committee committee = committeeRepository.findById(committeeId).orElseThrow();

            // Auto-assign INNOVATOR role on first submission
            if (!user.getRoles().contains("INNOVATOR")) {
                user.getRoles().add("INNOVATOR");
                userRepository.save(user);
            }

            String filePath = saveFile(file);

            Patent patent = new Patent();
            patent.setTitle(title);
            patent.setDescription(description);
            patent.setCategory(category);
            patent.setUser(user);
            patent.setAssignedCommittee(committee);
            patent.setStatus(Status.PENDING);
            patent.setAttachmentPath(filePath);
            patent.setOriginalFileName(file.getOriginalFilename());
            patent.setFileType(file.getContentType());
            patent.setResubmitted(false);
            
            return ResponseEntity.ok(patentRepository.save(patent));

        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("File system error: " + e.getMessage());
        }
    }

    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Transactional
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("category") String category,
            @RequestParam(value = "file", required = false) MultipartFile file,
            Principal principal) {

        Patent existing = patentRepository.findById(id).orElseThrow();

        // Ownership Validation
        if (!existing.getUser().getEmail().equals(principal.getName())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied");
        }

        existing.setTitle(title);
        existing.setDescription(description);
        existing.setCategory(category);
        
        // If updating a rejected patent, mark as resubmitted and reset status
        if (existing.getStatus() == Status.REJECTED) {
            existing.setStatus(Status.PENDING);
            existing.setResubmitted(true);
        }

        if (file != null && !file.isEmpty()) {
            try {
                existing.setAttachmentPath(saveFile(file));
                existing.setOriginalFileName(file.getOriginalFilename());
                existing.setFileType(file.getContentType());
            } catch (IOException e) {
                return ResponseEntity.internalServerError().body("Update failed.");
            }
        }

        return ResponseEntity.ok(patentRepository.save(existing));
    }

    // ==========================================
    // 3. REVIEW & NOTIFICATION SYSTEM
    // ==========================================

    @PutMapping("/review/{id}")
    @Transactional
    public ResponseEntity<?> review(
            @PathVariable Long id, 
            @RequestParam String status, 
            @RequestParam String feedback) {
        
        Patent p = patentRepository.findById(id).orElseThrow();
        
        try {
            Status newStatus = Status.valueOf(status.toUpperCase());
            p.setStatus(newStatus);
            p.setReviewerFeedback(feedback);
            
            Patent updated = patentRepository.save(p);

            // MULTI-CHANNEL NOTIFICATION (Email + Profile Alert)
            notificationService.sendStatusUpdate(updated.getUser(), updated.getTitle(), newStatus.name());

            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid Status. Use APPROVED or REJECTED.");
        }
    }

    // ==========================================
    // 4. FILE STREAMING & CLEANUP
    // ==========================================

    @GetMapping("/view/{id}")
    public ResponseEntity<Resource> viewFile(@PathVariable Long id) {
        try {
            Patent patent = patentRepository.findById(id).orElseThrow();
            Path path = Paths.get(patent.getAttachmentPath());
            Resource resource = new UrlResource(path.toUri());

            if (!resource.exists()) return ResponseEntity.notFound().build();

            // Inline streaming allows PDF/Video playback in the browser
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(patent.getFileType() != null ? patent.getFileType() : "application/octet-stream"))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + patent.getOriginalFileName() + "\"")
                    .body(resource);
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/delete/{id}")
    @Transactional
    public ResponseEntity<?> delete(@PathVariable Long id, Principal principal) {
        Patent p = patentRepository.findById(id).orElseThrow();
        User owner = p.getUser();
        User currentUser = userRepository.findByEmail(principal.getName()).orElseThrow();

        // Security: Only ADMIN or Owner (if rejected) can delete
        if (!currentUser.getRoles().contains("ADMIN") && 
           !(owner.getEmail().equals(principal.getName()) && p.getStatus() == Status.REJECTED)) {
            return ResponseEntity.status(403).body("Unauthorized delete.");
        }

        patentRepository.delete(p);

        // Cleanup: Remove INNOVATOR role if they have no more patents
        if (patentRepository.findByUser(owner).isEmpty()) {
            owner.getRoles().remove("INNOVATOR");
            userRepository.save(owner);
        }
        return ResponseEntity.ok("Deleted.");
    }

    /**
     * Internal helper to handle file storage logic.
     */
    private String saveFile(MultipartFile file) throws IOException {
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        // Use timestamp to ensure unique filenames
        String uniqueFileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(uniqueFileName); 
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        return filePath.toString();
    }
}