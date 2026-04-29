package innoandpatentms.iapms.controller;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
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
import innoandpatentms.iapms.entity.User;
import innoandpatentms.iapms.repository.CommitteeRepository;
import innoandpatentms.iapms.repository.PatentRepository;
import innoandpatentms.iapms.repository.UserRepository;
import lombok.RequiredArgsConstructor;

/**
 * Main Controller for the Innovation and Patent Management System (IAPMS).
 * Updated to handle File Uploads (PDF, Image, Video) and Local Storage.
 */
@RestController
@RequestMapping("/api/v1.0/patents")
@RequiredArgsConstructor
public class PatentController {

    private final PatentRepository patentRepository;
    private final UserRepository userRepository;
    private final CommitteeRepository committeeRepository;

    // LOCAL STORAGE CONFIGURATION
    private final String UPLOAD_DIR = "C:/iapms_system/uploads/";

    // ==========================================
    // SECTION 1: DASHBOARD VIEWS
    // ==========================================

    @GetMapping
    public ResponseEntity<?> getAll(Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRoles().contains("ADMIN")) {
            return ResponseEntity.ok(patentRepository.findAll());
        }
        return ResponseEntity.ok(patentRepository.findByUser(user));
    }

    @GetMapping("/review-list")
    public ResponseEntity<?> getMyReviewList(Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Committee> myCommittees = committeeRepository.findByMembersContaining(user);
        return ResponseEntity.ok(patentRepository.findByAssignedCommitteeIn(myCommittees));
    }

    // ==========================================
    // SECTION 2: INNOVATOR ACTIONS (Updated for Files)
    // ==========================================

    /**
     * Submits a new patent with an attached file.
     * 1. Upgrades user to INNOVATOR if necessary.
     * 2. Automatically creates the storage directory if missing.
     * 3. Saves physical file to disk and metadata to DB.
     */

    @PostMapping(value = "/submit/{committeeId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Transactional // Ensures DB rolls back if file saving fails
    public ResponseEntity<?> submit(
            @PathVariable Long committeeId,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("category") String category,
            @RequestParam("file") MultipartFile file,
            Principal principal) {

        try {
            // 1. Identify the User (Innovator)
            User user = userRepository.findByEmail(principal.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            // 2. Identify the Committee
            Committee committee = committeeRepository.findById(committeeId)
                    .orElseThrow(() -> new RuntimeException("Selected Committee not found"));

            // 3. Role Upgrade Logic
            if (!user.getRoles().contains("INNOVATOR")) {
                user.getRoles().add("INNOVATOR");
                userRepository.save(user);
            }

            // 4. SMART FOLDER CREATION
            // Paths.get handles slashes correctly for Windows or Linux
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                // This creates all folders in the path (e.g., C:/iapms_system/uploads/)
                Files.createDirectories(uploadPath);
            }

            // 5. Generate Unique File Name
            String uniqueFileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(uniqueFileName); // Safely joins path and filename

            // 6. Save Physical File to Computer
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // 7. Create and Map Patent Entity
            Patent patent = new Patent();
            patent.setTitle(title);
            patent.setDescription(description);
            patent.setCategory(category);
            patent.setUser(user);
            patent.setAssignedCommittee(committee);
            patent.setStatus("PENDING");
            patent.setResubmitted(false);
            
            // Save File Metadata for later retrieval/viewing
            patent.setAttachmentPath(filePath.toString());
            patent.setOriginalFileName(file.getOriginalFilename());
            patent.setFileType(file.getContentType());

            Patent savedPatent = patentRepository.save(patent);
            
            // 8. Construct Success Response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Success: Patent and file uploaded to " + committee.getName());
            response.put("patentId", savedPatent.getId());
            response.put("fileName", savedPatent.getOriginalFileName());
            
            return ResponseEntity.ok(response);

        } catch (IOException e) {
            // Error handling for file system issues
            return ResponseEntity.internalServerError()
                    .body("File System Error: Could not create folder or save file. " + e.getMessage());
        } catch (Exception e) {
            // General error handling
            return ResponseEntity.badRequest()
                    .body("Submission Error: " + e.getMessage());
        }
    }

    /**
     * Updates existing patent and handles optional file replacement.
     */
    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Transactional
    public ResponseEntity<?> update(
            @PathVariable Long id, 
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("category") String category,
            @RequestParam(value = "file", required = false) MultipartFile file,
            Principal principal) throws IOException {

        Patent existing = patentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patent not found"));
        
        if (!existing.getUser().getEmail().equals(principal.getName())) {
            return ResponseEntity.status(403).body("Unauthorized");
        }

        // Lock check
        if (!"PENDING".equals(existing.getStatus()) && !"MODIFICATION_REQUIRED".equals(existing.getStatus())) {
            return ResponseEntity.badRequest().body("Locked: Patent cannot be edited.");
        }

        // Set Resubmitted Memory Flag
        if ("MODIFICATION_REQUIRED".equals(existing.getStatus())) {
            existing.setResubmitted(true); 
        }

        // Update Fields
        existing.setTitle(title);
        existing.setDescription(description);
        existing.setCategory(category);
        existing.setStatus("PENDING"); // Move back to review queue

        // Optional: Replace File if a new one is provided
        if (file != null && !file.isEmpty()) {
            String uniqueFileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIR + uniqueFileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            existing.setAttachmentPath(filePath.toString());
            existing.setOriginalFileName(file.getOriginalFilename());
            existing.setFileType(file.getContentType());
        }

        return ResponseEntity.ok(patentRepository.save(existing));
    }

    // ==========================================
    // SECTION 3: REVIEWER DECISIONS
    // ==========================================

    @PutMapping("/review/{id}")
    public ResponseEntity<?> review(@PathVariable Long id, @RequestParam String status, @RequestParam String feedback) {
        Patent p = patentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patent not found"));
        
        String action = status.toUpperCase();

        if (action.equals("MODIFICATION")) {
            p.setStatus("MODIFICATION_REQUIRED");
            p.setResubmitted(false); 
        } else {
            p.setStatus(action);
        }

        p.setReviewerFeedback(feedback);
        return ResponseEntity.ok(patentRepository.save(p));
    }

    // ==========================================
    // SECTION 4: SEARCH & DELETE
    // ==========================================

    @GetMapping("/search")
    public ResponseEntity<?> search(@RequestParam String q, Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        List<Patent> allMatched = patentRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(q, q);

        if (user.getRoles().contains("ADMIN")) return ResponseEntity.ok(allMatched);
        
        return ResponseEntity.ok(allMatched.stream()
        .filter(p -> "APPROVED".equals(p.getStatus()) || p.getUser().equals(user))
        .collect(Collectors.toList()));
    }


    @DeleteMapping("/delete/{id}")
    @Transactional
    public ResponseEntity<?> delete(@PathVariable Long id, Principal principal) {
        Patent p = patentRepository.findById(id).orElseThrow();
        User owner = p.getUser();
        User currentUser = userRepository.findByEmail(principal.getName()).orElseThrow();

        boolean isAdmin = currentUser.getRoles().contains("ADMIN");
        boolean isOwner = owner.getEmail().equals(principal.getName());

        if (!isAdmin && !(isOwner && "REJECTED".equalsIgnoreCase(p.getStatus()))) {
            return ResponseEntity.status(403).body("Unauthorized: Owners can only delete REJECTED patents.");
        }

        // Logic to delete the physical file from disk can be added here if desired
        patentRepository.delete(p);

        if (patentRepository.findByUser(owner).isEmpty()) {
            owner.getRoles().remove("INNOVATOR");
            userRepository.save(owner);
        }
        return ResponseEntity.ok("Deleted successfully. Roles updated.");
    }

    @GetMapping("/view/{id}")
    public ResponseEntity<Resource> viewFile(@PathVariable Long id) {
        try {
            Patent patent = patentRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Patent not found"));

            Path path = Paths.get(patent.getAttachmentPath());
            Resource resource = new UrlResource(path.toUri());

            if (!resource.exists()) {
                throw new RuntimeException("File not found on disk at: " + patent.getAttachmentPath());
            }

            // Determine the content type (PDF, Image, or Video)
            String contentType = patent.getFileType();
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    // "inline" opens it in the browser; "attachment" forces a download
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + patent.getOriginalFileName() + "\"")
                    .body(resource);

        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}