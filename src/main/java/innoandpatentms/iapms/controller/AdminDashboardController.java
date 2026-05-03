package innoandpatentms.iapms.controller;

<<<<<<< HEAD
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import innoandpatentms.iapms.entity.Status; // Added Enum Import
import innoandpatentms.iapms.repository.PatentRepository;
import innoandpatentms.iapms.repository.UserRepository;
import innoandpatentms.iapms.service.AdminService;
import lombok.RequiredArgsConstructor;

/**
 * Specialized controller for Admin Dashboard visualization data.
 * Focuses on counts, trends, and recent activity.
 */
@RestController
@RequestMapping("/api/v1.0/admin-dashboard") // Changed path to avoid conflict with AdminController
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ADMIN')") // Secures all endpoints in this class
=======
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
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
public class AdminDashboardController {

    private final PatentRepository patentRepository;
    private final UserRepository userRepository;
<<<<<<< HEAD
    private final AdminService adminService;

    /**
     * Data for Dashboard Cards and the "Latest Submissions" table.
     * Uses Enum-based counts to ensure compatibility.
     */
    @GetMapping("/overview")
    public ResponseEntity<Map<String, Object>> getDashboardOverview() {
        Map<String, Object> stats = new HashMap<>();
        
        // General Counts
        stats.put("totalPatents", patentRepository.count());
        stats.put("totalInventors", userRepository.countByRolesContaining("INNOVATOR"));
        
        // Status-specific counts using the Enum
        stats.put("approved", patentRepository.countByStatus(Status.APPROVED));
        stats.put("pending", patentRepository.countByStatus(Status.PENDING));
        stats.put("rejected", patentRepository.countByStatus(Status.REJECTED));
        
        // Data for "Latest Submissions" table
        stats.put("latestSubmissions", patentRepository.findTop10ByOrderByCreatedAtDesc());
        
        return ResponseEntity.ok(stats);
    }

    /**
     * Detailed stats provided by the AdminService.
     */
    @GetMapping("/advanced-stats")
    public ResponseEntity<?> getAdvancedStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }
=======

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
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
}