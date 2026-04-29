package innoandpatentms.iapms.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity; // FIXED: Missing import
import org.springframework.security.access.prepost.PreAuthorize; // PRO TIP: Security
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import innoandpatentms.iapms.entity.User;
import innoandpatentms.iapms.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1.0/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    /**
     * ADMIN FEATURE: Get all users for the "Manage Users" table.
     * This will now include 'createdAt', 'updatedAt', and 'fullName'.
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')") // Ensures only Admins can see the user list
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    /**
     * USER FEATURE: Get current user profile details.
     * This allows the logged-in user to see their own account creation date.
     */
    @GetMapping("/profile")
    public ResponseEntity<User> getMyProfile(Principal principal) {
        // principal.getName() usually returns the email/username
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return ResponseEntity.ok(user);
    }
}