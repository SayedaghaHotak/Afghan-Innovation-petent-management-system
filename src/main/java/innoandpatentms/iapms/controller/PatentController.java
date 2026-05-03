package innoandpatentms.iapms.controller;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.Principal;
<<<<<<< HEAD
import java.util.List;
=======
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
<<<<<<< HEAD
import org.springframework.http.HttpStatus;
=======
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
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
<<<<<<< HEAD
import innoandpatentms.iapms.entity.Status;
=======
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
import innoandpatentms.iapms.entity.User;
import innoandpatentms.iapms.repository.CommitteeRepository;
import innoandpatentms.iapms.repository.PatentRepository;
import innoandpatentms.iapms.repository.UserRepository;
<<<<<<< HEAD
import innoandpatentms.iapms.service.NotificationService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Setter
@Getter
=======
import lombok.RequiredArgsConstructor;

/**
 * Main Controller for the Innovation and Patent Management System (IAPMS).
 * Updated to handle File Uploads (PDF, Image, Video) and Local Storage.
 */
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
@RestController
@RequestMapping("/api/v1.0/patents")
@RequiredArgsConstructor
public class PatentController {

    private final PatentRepository patentRepository;
    private final UserRepository userRepository;
    private final CommitteeRepository committeeRepository;
<<<<<<< HEAD
    private final NotificationService notificationService;

    // Define where files are stored locally
    private final String UPLOAD_DIR = "C:/iapms_system/uploads/";

    // ==========================================
    // 1. ACCESS & SEARCH
=======

    // LOCAL STORAGE CONFIGURATION
    private final String UPLOAD_DIR = "C:/iapms_system/uploads/";

    // ==========================================
    // SECTION 1: DASHBOARD VIEWS
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
    // ==========================================

    @GetMapping
    public ResponseEntity<?> getAll(Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

<<<<<<< HEAD
        // ADMINs see everything; Users see their own submissions
=======
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
        if (user.getRoles().contains("ADMIN")) {
            return ResponseEntity.ok(patentRepository.findAll());
        }
        return ResponseEntity.ok(patentRepository.findByUser(user));
    }

    @GetMapping("/review-list")
    public ResponseEntity<?> getMyReviewList(Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

<<<<<<< HEAD
        // Get patents assigned to committees this user belongs to
=======
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
        List<Committee> myCommittees = committeeRepository.findByMembersContaining(user);
        return ResponseEntity.ok(patentRepository.findByAssignedCommitteeIn(myCommittees));
    }

    // ==========================================
<<<<<<< HEAD
    // 2. SUBMISSION & EDITING
    // ==========================================

    @PostMapping(value = "/submit/{committeeId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Transactional
=======
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
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
    public ResponseEntity<?> submit(
            @PathVariable Long committeeId,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("category") String category,
            @RequestParam("file") MultipartFile file,
            Principal principal) {

        try {
<<<<<<< HEAD
            User user = userRepository.findByEmail(principal.getName()).orElseThrow();
            Committee committee = committeeRepository.findById(committeeId).orElseThrow();

            // Auto-assign INNOVATOR role on first submission
=======
            // 1. Identify the User (Innovator)
            User user = userRepository.findByEmail(principal.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            // 2. Identify the Committee
            Committee committee = committeeRepository.findById(committeeId)
                    .orElseThrow(() -> new RuntimeException("Selected Committee not found"));

            // 3. Role Upgrade Logic
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
            if (!user.getRoles().contains("INNOVATOR")) {
                user.getRoles().add("INNOVATOR");
                userRepository.save(user);
            }

<<<<<<< HEAD
            String filePath = saveFile(file);

=======
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
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
            Patent patent = new Patent();
            patent.setTitle(title);
            patent.setDescription(description);
            patent.setCategory(category);
            patent.setUser(user);
            patent.setAssignedCommittee(committee);
<<<<<<< HEAD
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
=======
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
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("category") String category,
            @RequestParam(value = "file", required = false) MultipartFile file,
<<<<<<< HEAD
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
=======
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
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
        }

        return ResponseEntity.ok(patentRepository.save(existing));
    }

    // ==========================================
<<<<<<< HEAD
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

=======
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


>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
    @DeleteMapping("/delete/{id}")
    @Transactional
    public ResponseEntity<?> delete(@PathVariable Long id, Principal principal) {
        Patent p = patentRepository.findById(id).orElseThrow();
        User owner = p.getUser();
        User currentUser = userRepository.findByEmail(principal.getName()).orElseThrow();

<<<<<<< HEAD
        // Security: Only ADMIN or Owner (if rejected) can delete
        if (!currentUser.getRoles().contains("ADMIN") && 
           !(owner.getEmail().equals(principal.getName()) && p.getStatus() == Status.REJECTED)) {
            return ResponseEntity.status(403).body("Unauthorized delete.");
        }

        patentRepository.delete(p);

        // Cleanup: Remove INNOVATOR role if they have no more patents
=======
        boolean isAdmin = currentUser.getRoles().contains("ADMIN");
        boolean isOwner = owner.getEmail().equals(principal.getName());

        if (!isAdmin && !(isOwner && "REJECTED".equalsIgnoreCase(p.getStatus()))) {
            return ResponseEntity.status(403).body("Unauthorized: Owners can only delete REJECTED patents.");
        }

        // Logic to delete the physical file from disk can be added here if desired
        patentRepository.delete(p);

>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
        if (patentRepository.findByUser(owner).isEmpty()) {
            owner.getRoles().remove("INNOVATOR");
            userRepository.save(owner);
        }
<<<<<<< HEAD
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
=======
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
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
    }
}