package innoandpatentms.iapms.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
<<<<<<< HEAD
import java.util.Set;
import java.util.stream.Collectors;
=======
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import innoandpatentms.iapms.dto.UserDTO;
<<<<<<< HEAD
import innoandpatentms.iapms.entity.Committee;
import innoandpatentms.iapms.entity.LoginRequest;
import innoandpatentms.iapms.entity.LoginResponse;
import innoandpatentms.iapms.entity.Status; // IMPORT ENUM
=======
import innoandpatentms.iapms.entity.LoginRequest;
import innoandpatentms.iapms.entity.LoginResponse;
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
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
<<<<<<< HEAD
=======
        // 1. Check for Validation Errors (NotBlank, Email, Pattern, etc.)
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(result.getAllErrors().get(0).getDefaultMessage());
        }

<<<<<<< HEAD
=======
        // 2. STRICT CHECK: Password and Confirm Password must match
        // We check this BEFORE checking the database or creating the User object
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
        if (userDto.getConfirmPassword() == null || !userDto.getPassword().equals(userDto.getConfirmPassword())) {
            return ResponseEntity.badRequest().body("Passwords do not match!");
        }

<<<<<<< HEAD
=======
        // 3. STRICT CHECK: Email Uniqueness
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
        if (userRepository.existsByEmail(userDto.getEmail())) {
            return ResponseEntity.badRequest().body("Email already in use!");
        }

<<<<<<< HEAD
=======
        // 4. Data is valid, now we prepare the Entity
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
        User user = new User();
        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setEmail(userDto.getEmail());
        user.setPhoneNumber(userDto.getPhoneNumber());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
<<<<<<< HEAD
        
        // Default role for new sign-ups
        user.setRoles(new HashSet<>(Collections.singleton("USER"))); 
        
        userRepository.save(user);
=======
        user.setRoles(new HashSet<>(Collections.singleton("USER"))); 
        
        // 5. Final Step: Save to Database
        userRepository.save(user);
        
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
        return ResponseEntity.ok("Registered successfully!");
    }

    @PostMapping("/login")
<<<<<<< HEAD
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
=======
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
<<<<<<< HEAD

            // 1. Generate Token
            String token = "generated-jwt-token"; 

            // 2. Prepare Dashboard Stats (for Argument 8)
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalApproved", patentRepository.countByStatus(Status.APPROVED));
            stats.put("totalRejected", patentRepository.countByStatus(Status.REJECTED));
            stats.put("totalPending", patentRepository.countByStatus(Status.PENDING));
            
            // 3. Extract Committee Names (for Argument 6)
            Set<String> committeeNames = user.getCommittees().stream()
                .map(Committee::getName)
                .collect(Collectors.toSet());

            // 4. Initialize Extra Info (for Argument 7)
            Map<String, Object> extraInfo = new HashMap<>(); 

            // 5. Return with 8 arguments to match LoginResponse definition
            return ResponseEntity.ok(new LoginResponse(
                token,               // Arg 1
                user.getFirstName(), // Arg 2
                user.getLastName(),  // Arg 3
                user.getEmail(),     // Arg 4
                user.getRoles(),     // Arg 5
                committeeNames,      // Arg 6
                extraInfo,           // Arg 7
                stats                // Arg 8 (dashboardSummary)
            ));
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }
}
=======
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalApproved", patentRepository.findByStatus("APPROVED").size());
            
            return ResponseEntity.ok(new LoginResponse("Success", user.getFirstName(), user.getRoles(), stats));
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }

}
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
