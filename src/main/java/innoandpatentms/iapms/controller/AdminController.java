package innoandpatentms.iapms.controller;

import java.util.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import innoandpatentms.iapms.entity.*;
import innoandpatentms.iapms.repository.*;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1.0/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final PatentRepository patentRepository;
    private final CommitteeRepository committeeRepository;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PutMapping("/role-toggle/{userId}")
    public ResponseEntity<?> toggleRole(@PathVariable Long userId, @RequestParam String role, @RequestParam boolean add) {
        User user = userRepository.findById(userId).orElseThrow();
        if (add) user.getRoles().add(role.toUpperCase());
        else user.getRoles().remove(role.toUpperCase());
        
        userRepository.save(user);
        return ResponseEntity.ok("Role updated successfully.");
    }

    @PutMapping("/decide/{id}")
    public ResponseEntity<?> adminDecide(@PathVariable Long id, @RequestParam String status, @RequestParam String feedback) {
        Patent p = patentRepository.findById(id).orElseThrow();
        p.setStatus(status.toUpperCase());
        p.setReviewerFeedback(feedback);
        return ResponseEntity.ok(patentRepository.save(p));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalCommittees", committeeRepository.count());
        stats.put("pendingPatents", patentRepository.findByStatus("PENDING").size());
        return ResponseEntity.ok(stats);
    }
}