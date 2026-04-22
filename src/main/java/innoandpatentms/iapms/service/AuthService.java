
package innoandpatentms.iapms.service;

import java.util.Set;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import innoandpatentms.iapms.dto.UserDTO;
import innoandpatentms.iapms.entity.User;
import innoandpatentms.iapms.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User registerUser(UserDTO dto) {
        // 1. Strict Constraint: Password Match
        if (!dto.getPassword().equals(dto.getConfirmPassword())) {
            throw new RuntimeException("Validation Error: Passwords do not match!");
        }

        // 2. Strict Constraint: Unique Email
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Validation Error: An account with this email already exists!");
        }

        // 3. Mapping to Entity (confirmPassword is NOT mapped here)
        User user = new User();
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPhoneNumber(dto.getPhoneNumber());
        
        // Only the hashed password is saved
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRoles(Set.of("USER")); 

        return userRepository.save(user);
    }
}