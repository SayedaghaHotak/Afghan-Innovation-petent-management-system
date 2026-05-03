package innoandpatentms.iapms.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import innoandpatentms.iapms.entity.Patent;
<<<<<<< HEAD
import innoandpatentms.iapms.entity.Status; // IMPORT ENUM
=======
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
import innoandpatentms.iapms.repository.PatentRepository;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1.0/reviewer")
@RequiredArgsConstructor
@PreAuthorize("hasRole('REVIEWER')")
public class ReviewerController {

    private final PatentRepository patentRepository;

    @PutMapping("/decide/{patentId}")
    public ResponseEntity<?> examinePatent(
            @PathVariable Long patentId,
            @RequestParam String status,
            @RequestParam String feedback) {
        
<<<<<<< HEAD
        Patent patent = patentRepository.findById(patentId)
                .orElseThrow(() -> new RuntimeException("Patent not found"));
        
        try {
            // Convert input string to Status Enum
            // This now supports APPROVED, REJECTED, and REQUEST_MODIFICATION
            Status decision = Status.valueOf(status.toUpperCase());
            
            // Logic to handle the "Resubmitted" flag
            if (decision == Status.REJECTED) {
                patent.setResubmitted(false); // Reset flag until innovator updates it
            }
            
            patent.setStatus(decision);
            patent.setReviewerFeedback(feedback);
            
            patentRepository.save(patent);
            return ResponseEntity.ok("Decision recorded: " + decision);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid status. Please use APPROVED, or REJECTED.");
        }
=======
        Patent patent = patentRepository.findById(patentId).orElseThrow();
        
        if (!status.equalsIgnoreCase("APPROVED") && !status.equalsIgnoreCase("REJECTED")) {
            return ResponseEntity.badRequest().body("Invalid status.");
        }

        patent.setStatus(status.toUpperCase());
        patent.setReviewerFeedback(feedback);
        
        patentRepository.save(patent);
        return ResponseEntity.ok("Decision recorded: " + status);
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
    }
}