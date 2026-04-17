package innoandpatentms.iapms.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
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
import innoandpatentms.iapms.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1.0")
@RequiredArgsConstructor

public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

        @PostMapping("/register")
        public ResponseEntity<?> register(@Valid @RequestBody UserDTO userDto, BindingResult result) {
            
            // 1. Validation check
            if (result.hasErrors()) {
                return ResponseEntity.badRequest().body(result.getAllErrors().get(0).getDefaultMessage());
            }

            // 2. Email uniqueness check
            if (userRepository.existsByEmail(userDto.getEmail())) {
                return ResponseEntity.badRequest().body("Error: Email already in use!");
            }

            // 3. Confirm Password check
            if (!userDto.getPassword().equals(userDto.getConfirmPassword())) {
                return ResponseEntity.badRequest().body("Error: Passwords do not match!");
            }

            // 4. MAPPING: Create a NEW User object and manually copy only allowed fields
            User user = new User();
            user.setFirstName(userDto.getFirstName());
            user.setLastName(userDto.getLastName());
            user.setEmail(userDto.getEmail());
            user.setPhoneNumber(userDto.getPhoneNumber());
            user.setPassword(passwordEncoder.encode(userDto.getPassword()));
            
            // 5. SECURE: Hardcode the role here. 
            // Even if Postman sends "admin", this line overwrites it with "USER"
            user.setRoles(Collections.singleton("USER")); 
            
            userRepository.save(user);
            return ResponseEntity.ok("User registered successfully!");
        }

        @PostMapping("/login")
        public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
            User user = userRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                
                // Operation example : Prepare stats for the dashboard
                Map<String, Object> stats = new HashMap<>();
                if (user.getRoles().contains("USER")) {
                // we would call a service: patentService.countByOwner(user.getId())
                    stats.put("activeSubmissions", 3); 
                    stats.put("notifications", 1);
                }

                LoginResponse response = new LoginResponse(
                    "Login Successful",
                    user.getFirstName(),
                    user.getRoles(),
                    stats
                );
                
                return ResponseEntity.ok(response);
            }
            return ResponseEntity.status(401).body("Invalid credentials");
        }
}