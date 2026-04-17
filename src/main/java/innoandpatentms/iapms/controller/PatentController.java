package innoandpatentms.iapms.controller;

import java.security.Principal;
import java.io.IOException; // Corrected Import
import java.nio.file.Files; // Added for file saving
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import innoandpatentms.iapms.entity.Patent;
import innoandpatentms.iapms.entity.User;
import innoandpatentms.iapms.repository.PatentRepository;
import innoandpatentms.iapms.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1.0/patents")
@RequiredArgsConstructor
public class PatentController {

    private final PatentRepository patentRepository;
    private final UserRepository userRepository;

    @PostMapping(value = "/submit", consumes = {"multipart/form-data"})
    public ResponseEntity<?> submitIdea(
            @RequestPart("patent") Patent patent, 
            @RequestPart("file") MultipartFile file,
            Principal principal) throws IOException { // Now using java.io.IOException

        // 1. Validate File Type (PDF Only)
        if (file.isEmpty() || ! "application/pdf".equals(file.getContentType())) {
            return ResponseEntity.badRequest().body("Error: Only PDF files are acceptable!");
        }

        // 2. Identify and Update User
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Dynamic Role Upgrade
        if (!user.getRoles().contains("INNOVATOR")) {
            user.getRoles().add("INNOVATOR");
            userRepository.save(user);
        }

        // 3. Save File to local storage
        String uploadDir = "uploads/patents/";
        java.io.File directory = new java.io.File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadDir + fileName);
        Files.copy(file.getInputStream(), filePath);

        // 4. Link data and save to Database
        patent.setUser(user);
        patent.setAttachmentPath(filePath.toString());
        patent.setStatus("PENDING");
        
        patentRepository.save(patent);

        return ResponseEntity.ok("Success: Idea and PDF submitted successfully!");
    }
}