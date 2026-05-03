package innoandpatentms.iapms.service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import innoandpatentms.iapms.entity.User;
import innoandpatentms.iapms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 1. Fetch user from DB by email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User with email " + email + " not found"));

        // 2. Map roles to Spring Authorities with extra safety checks
        // Added a null check for user.getRoles() to ensure reliability
        // Change this part in loadUserByUsername method:
       // Inside loadUserByUsername, change the map logic to this:
        List<SimpleGrantedAuthority> authorities = (user.getRoles() == null) 
            ? Collections.emptyList() 
            : user.getRoles().stream()
                .filter(role -> role != null && !role.isBlank())
                .map(role -> new SimpleGrantedAuthority(role.trim().toUpperCase()))
                .collect(Collectors.toList());

        // DEBUG: Check your console! If this shows [], your user has no roles in the DB.
        log.info("Authentication Attempt: User [{}] found with authorities {}", email, authorities);

        // 3. Return the Spring Security User object
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                authorities
        );
    }
}