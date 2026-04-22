
package innoandpatentms.iapms.repository;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import innoandpatentms.iapms.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);

    // FIX: Use a custom query to find users who have "INNOVATOR" in their roles set
    @Query("SELECT u FROM User u JOIN u.roles r WHERE r = 'INNOVATOR'")
    List<User> findAllInnovators();
}