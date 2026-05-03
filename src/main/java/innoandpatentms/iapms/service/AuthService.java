package innoandpatentms.iapms.service;

import java.util.Set;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import innoandpatentms.iapms.dto.UserDTO;
import innoandpatentms.iapms.entity.User;
import innoandpatentms.iapms.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Registers a new user in the IAPMS system.
     * Uses @Transactional to ensure database integrity.
     */
    @Transactional
    public User registerUser(UserDTO dto) {
        // 1. Password Match Validation
        if (!dto.getPassword().equals(dto.getConfirmPassword())) {
            throw new RuntimeException("Validation Error: Passwords do not match!");
        }

        // 2. Unique Email Constraint
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Validation Error: An account with this email already exists!");
        }

        // 3. Mapping DTO to Entity
        User user = new User();
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPhoneNumber(dto.getPhoneNumber());
        
        // Security: Hash the password before saving
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        
        /**
         * Set default role. 
         * For IAPMS, you might want to default new users to "INNOVATOR" 
         * so they can immediately start submitting patents.
         */
        user.setRoles(Set.of("INNOVATOR")); 

        return userRepository.save(user);
    }
}