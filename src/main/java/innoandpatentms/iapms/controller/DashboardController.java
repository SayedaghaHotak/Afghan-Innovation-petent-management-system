
package innoandpatentms.iapms.controller;
import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import innoandpatentms.iapms.entity.Status;
import innoandpatentms.iapms.entity.User;
import innoandpatentms.iapms.repository.PatentRepository;
import innoandpatentms.iapms.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1.0")
@RequiredArgsConstructor
public class DashboardController {

    private final UserRepository userRepository;
    private final PatentRepository patentRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<?> getSmartDashboard(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 1. Role Priority Check
        String primaryRole = "USER";
        if (user.getRoles().contains("ADMIN")) {
            primaryRole = "ADMIN";
        } else if (user.getRoles().contains("REVIEWER")) {
            primaryRole = "REVIEWER";
        } else if (user.getRoles().contains("INNOVATOR")) {
            primaryRole = "INNOVATOR";
        }

        Map<String, Object> response = new HashMap<>();
        response.put("role", primaryRole);
        response.put("firstName", user.getFirstName());

        // 2. Modernized Switch logic (Java 25 compatible)
        switch (primaryRole) {
            case "ADMIN" -> {
                response.put("allUsers", userRepository.findAll());
                response.put("allPatents", patentRepository.findAll());
            }
            case "REVIEWER" -> 
                // Fetches patents assigned to the committees this user belongs to
                response.put("assignedPatents", patentRepository.findByAssignedCommitteeIn(user.getCommittees()));
            
            case "INNOVATOR" -> {
                // Fetches patents owned by this specific user
                response.put("myPatents", patentRepository.findByUser(user));
                response.put("publicGallery", getPublicGalleryData());
            }
            default -> response.put("publicGallery", getPublicGalleryData());
        }
        
        return ResponseEntity.ok(response);
    }

    private List<Map<String, String>> getPublicGalleryData() {
        return patentRepository.findByStatus(Status.APPROVED).stream()
                .map(p -> {
                    Map<String, String> data = new HashMap<>();
                    data.put("id", String.valueOf(p.getId()));
                    data.put("title", p.getTitle() != null ? p.getTitle() : "Untitled");
                    data.put("owner", p.getUser() != null ? 
                             p.getUser().getFirstName() + " " + p.getUser().getLastName() : "Unknown");
                    return data;
                }).collect(Collectors.toList());
    }
}