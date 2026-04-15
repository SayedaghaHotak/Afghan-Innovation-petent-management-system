package innoandpatentms.iapms.controller;

import java.util.Collections;
import innoandpatentms.iapms.entity.User;
import innoandpatentms.iapms.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1.0")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody User user, BindingResult result) {
        
        // 1. Validation check (Alphabets, Patterns, etc.)
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(result.getAllErrors().get(0).getDefaultMessage());
        }

        // 2. Email uniqueness check
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email already in use!");
        }

        // 3. Confirm Password check
        if (!user.getPassword().equals(user.getConfirmPassword())) {
            return ResponseEntity.badRequest().body("Error: Passwords do not match!");
        }

        // 4. Save to DB (Only happens if everything above passed)
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRoles(Collections.singleton("INNOVATOR"));
        
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }
}