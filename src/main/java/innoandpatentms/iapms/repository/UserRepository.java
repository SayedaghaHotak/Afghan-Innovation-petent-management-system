package innoandpatentms.iapms.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import innoandpatentms.iapms.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    /**
     * AUTHENTICATION: Used by CustomUserDetailsService to load user during login.
     */
    Optional<User> findByEmail(String email);
    
    /**
     * VALIDATION: Used during registration to prevent duplicate accounts.
     */
    boolean existsByEmail(String email);

    /**
     * ADMIN FEATURE: Retrieves all users with the INNOVATOR role.
     * Uses JOIN to navigate the @ElementCollection 'roles'.
     */
    @Query("SELECT u FROM User u JOIN u.roles r WHERE r = 'INNOVATOR'")
    List<User> findAllInnovators();

    /**
     * DASHBOARD STATS: Counts users by a specific role (e.g., 'INNOVATOR').
     * Used in AdminService to populate totalInnovators.
     */
    @Query("SELECT COUNT(u) FROM User u JOIN u.roles r WHERE r = :role")
    long countByRolesContaining(@Param("role") String role);
}