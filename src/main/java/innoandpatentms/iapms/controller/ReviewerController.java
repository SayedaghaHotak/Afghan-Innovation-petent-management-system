package innoandpatentms.iapms.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import innoandpatentms.iapms.entity.Patent;
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
        
        Patent patent = patentRepository.findById(patentId).orElseThrow();
        
        if (!status.equalsIgnoreCase("APPROVED") && !status.equalsIgnoreCase("REJECTED")) {
            return ResponseEntity.badRequest().body("Invalid status.");
        }

        patent.setStatus(status.toUpperCase());
        patent.setReviewerFeedback(feedback);
        
        patentRepository.save(patent);
        return ResponseEntity.ok("Decision recorded: " + status);
    }
}