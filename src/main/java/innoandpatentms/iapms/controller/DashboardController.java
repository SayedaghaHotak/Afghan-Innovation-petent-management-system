package innoandpatentms.iapms.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1.0")
public class DashboardController {

    // USER DASHBOARD
    @GetMapping("/user/dashboard")
    public ResponseEntity<?> getUserDashboard() {
        return ResponseEntity.ok("Welcome to the User Dashboard! Here you can submit and track your patents.");
    }

    // EXAMINER DASHBOARD
    @GetMapping("/examiner/dashboard")
    public ResponseEntity<?> getExaminerDashboard() {
        return ResponseEntity.ok("Welcome to the Examiner Dashboard! Here you can review and manage patent applications assigned to you.");
    }

    // ADMIN DASHBOARD
    @GetMapping("/admin/dashboard")
    public ResponseEntity<?> getAdminDashboard() {
        return ResponseEntity.ok("Welcome to the Admin Dashboard! You have full control over users and system analytics.");
    }
}