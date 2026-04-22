package innoandpatentms.iapms.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import innoandpatentms.iapms.dto.UserDTO;
import innoandpatentms.iapms.entity.LoginRequest;
import innoandpatentms.iapms.entity.LoginResponse;
import innoandpatentms.iapms.entity.User;
import innoandpatentms.iapms.repository.PatentRepository;
import innoandpatentms.iapms.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1.0/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PatentRepository patentRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody UserDTO userDto, BindingResult result) {
        // 1. Check for Validation Errors (NotBlank, Email, Pattern, etc.)
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(result.getAllErrors().get(0).getDefaultMessage());
        }

        // 2. STRICT CHECK: Password and Confirm Password must match
        // We check this BEFORE checking the database or creating the User object
        if (userDto.getConfirmPassword() == null || !userDto.getPassword().equals(userDto.getConfirmPassword())) {
            return ResponseEntity.badRequest().body("Passwords do not match!");
        }

        // 3. STRICT CHECK: Email Uniqueness
        if (userRepository.existsByEmail(userDto.getEmail())) {
            return ResponseEntity.badRequest().body("Email already in use!");
        }

        // 4. Data is valid, now we prepare the Entity
        User user = new User();
        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setEmail(userDto.getEmail());
        user.setPhoneNumber(userDto.getPhoneNumber());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setRoles(new HashSet<>(Collections.singleton("USER"))); 
        
        // 5. Final Step: Save to Database
        userRepository.save(user);
        
        return ResponseEntity.ok("Registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalApproved", patentRepository.findByStatus("APPROVED").size());
            
            return ResponseEntity.ok(new LoginResponse("Success", user.getFirstName(), user.getRoles(), stats));
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }

}