package innoandpatentms.iapms.service;

import java.util.Set; // Add this import

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
        User user = new User();
        user.setFirstName(dto.getFirstName());
        user.setEmail(dto.getEmail());
        
        // This hashes the password before saving to PostgreSQL
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        
        // Default role is USER for the public
        user.setRoles(Set.of("USER")); 
        
        return userRepository.save(user);
    }
}