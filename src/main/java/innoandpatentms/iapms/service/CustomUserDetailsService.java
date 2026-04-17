package innoandpatentms.iapms.service;


import java.util.stream.Collectors;

import org.springframework.context.annotation.Primary;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService; // Added
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service; // Added

import innoandpatentms.iapms.entity.User;
import innoandpatentms.iapms.repository.UserRepository; // Added
import lombok.RequiredArgsConstructor; // Added

@Service
@Primary
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService { // Must implement interface

    private final UserRepository userRepository; // Added

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .authorities(user.getRoles().stream()
                        .map(role -> new SimpleGrantedAuthority("ROLE_" + role)) 
                        .collect(Collectors.toList()))
                .build();
    }
    
}