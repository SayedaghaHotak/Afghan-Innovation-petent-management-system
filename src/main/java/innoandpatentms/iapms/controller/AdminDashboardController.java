package innoandpatentms.iapms.controller;

import innoandpatentms.iapms.repository.PatentRepository;
import innoandpatentms.iapms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1.0/admin")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final PatentRepository patentRepository;
    private final UserRepository userRepository;

    @GetMapping("/dashboard-stats")
    public ResponseEntity<?> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Data for your Dashboard Cards
        stats.put("totalPatents", patentRepository.count());
        stats.put("totalInventors", userRepository.countByRolesContaining("INNOVATOR"));
        stats.put("approved", patentRepository.countByStatusApproved());
        stats.put("pending", patentRepository.countByStatusPending());
        stats.put("rejected", patentRepository.countByStatusRejected());
        
        // Data for "Latest Submissions" table
        stats.put("latestSubmissions", patentRepository.findTop5ByOrderByCreatedAtDesc());
        
        return ResponseEntity.ok(stats);
    }
}