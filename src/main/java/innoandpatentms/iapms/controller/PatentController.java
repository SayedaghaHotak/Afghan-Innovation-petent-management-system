package innoandpatentms.iapms.controller;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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

    /**
     * GET /api/v1.0/patents
     * This was missing, causing the 404 error.
     */
    @GetMapping
    public ResponseEntity<?> getAll(Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // If Admin, show everything in the system
        if (user.getRoles().contains("ADMIN")) {
            return ResponseEntity.ok(patentRepository.findAll());
        }

        // If Innovator/User, show only their specific patents
        return ResponseEntity.ok(patentRepository.findByUser(user));
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submit(@RequestBody Patent patent, Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Auto-upgrade logic: If they submit, they become an INNOVATOR
        if (!user.getRoles().contains("INNOVATOR")) {
            user.getRoles().add("INNOVATOR");
            userRepository.save(user);
        }
        
        patent.setUser(user);
        patent.setStatus("PENDING");
        return ResponseEntity.ok(patentRepository.save(patent));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Patent updatedData, Principal principal) {
        Patent existing = patentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patent not found"));
        
        // SECURITY: Ownership check
        if (!existing.getUser().getEmail().equals(principal.getName())) {
            return ResponseEntity.status(403).body("Unauthorized: You do not own this patent.");
        }

        // WORKFLOW: Only allow edit if still PENDING
        if (!"PENDING".equals(existing.getStatus())) {
            return ResponseEntity.badRequest().body("Locked: This patent is already under review.");
        }

        existing.setTitle(updatedData.getTitle());
        existing.setDescription(updatedData.getDescription());
        existing.setCategory(updatedData.getCategory());
        
        return ResponseEntity.ok(patentRepository.save(existing));
    }

    @GetMapping("/search")
    public ResponseEntity<?> search(@RequestParam String q, Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Patent> allMatched = patentRepository.findAll().stream()
                .filter(p -> p.getTitle().toLowerCase().contains(q.toLowerCase()))
                .collect(Collectors.toList());

        // Admins search everything
        if (user.getRoles().contains("ADMIN")) {
            return ResponseEntity.ok(allMatched);
        }
        
        // Others only search approved patents in the public gallery
        return ResponseEntity.ok(allMatched.stream()
            .filter(p -> "APPROVED".equals(p.getStatus()))
            .collect(Collectors.toList()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, Principal principal) {
        Patent p = patentRepository.findById(id).orElseThrow();
        
        // Security check: Only the owner or an ADMIN can delete
        if (!p.getUser().getEmail().equals(principal.getName())) {
            return ResponseEntity.status(403).body("Unauthorized");
        }
        
        patentRepository.delete(p);
        return ResponseEntity.ok("Deleted successfully");
    }
}