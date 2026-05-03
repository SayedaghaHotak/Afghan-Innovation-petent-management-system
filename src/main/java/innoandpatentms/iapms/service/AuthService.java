<<<<<<< HEAD
=======

>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
package innoandpatentms.iapms.service;

import java.util.Set;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
<<<<<<< HEAD
import org.springframework.transaction.annotation.Transactional;
=======
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b

import innoandpatentms.iapms.dto.UserDTO;
import innoandpatentms.iapms.entity.User;
import innoandpatentms.iapms.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

<<<<<<< HEAD
    /**
     * Registers a new user in the IAPMS system.
     * Uses @Transactional to ensure database integrity.
     */
    @Transactional
    public User registerUser(UserDTO dto) {
        // 1. Password Match Validation
=======
    public User registerUser(UserDTO dto) {
        // 1. Strict Constraint: Password Match
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
        if (!dto.getPassword().equals(dto.getConfirmPassword())) {
            throw new RuntimeException("Validation Error: Passwords do not match!");
        }

<<<<<<< HEAD
        // 2. Unique Email Constraint
=======
        // 2. Strict Constraint: Unique Email
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Validation Error: An account with this email already exists!");
        }

<<<<<<< HEAD
        // 3. Mapping DTO to Entity
=======
        // 3. Mapping to Entity (confirmPassword is NOT mapped here)
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
        User user = new User();
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPhoneNumber(dto.getPhoneNumber());
        
<<<<<<< HEAD
        // Security: Hash the password before saving
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        
        /**
         * Set default role. 
         * For IAPMS, you might want to default new users to "INNOVATOR" 
         * so they can immediately start submitting patents.
         */
        user.setRoles(Set.of("INNOVATOR")); 
=======
        // Only the hashed password is saved
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRoles(Set.of("USER")); 
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b

        return userRepository.save(user);
    }
}