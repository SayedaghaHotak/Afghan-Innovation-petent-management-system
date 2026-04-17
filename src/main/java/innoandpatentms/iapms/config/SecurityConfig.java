package innoandpatentms.iapms.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity // Add this!
public class SecurityConfig {

   @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // 1. Public endpoints
                .requestMatchers("/api/v1.0/register", "/api/v1.0/login").permitAll()
                
                // 2. Patent endpoints - allow BOTH User and Innovator
                .requestMatchers("/api/v1.0/patents/**").hasAnyRole("USER", "INNOVATOR") 
                
                .anyRequest().authenticated()
            )
            .httpBasic(Customizer.withDefaults()); // This enables the Basic Auth you use in Postman

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}