package innoandpatentms.iapms.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import innoandpatentms.iapms.entity.Committee;
import innoandpatentms.iapms.entity.User;

/**
 * Repository interface for Committee entity operations.
 */
@Repository
public interface CommitteeRepository extends JpaRepository<Committee, Long> {

    /**
     * Finds a committee by its exact name.
     * Useful for initial validation before applying semantic fingerprinting.
     */
    Optional<Committee> findByNameIgnoreCase(String name);

    /**
     * Checks if a committee exists with a specific name.
     */
    boolean existsByNameIgnoreCase(String name);
    List<Committee> findByMembersContaining(User user);

    /**
     * Checks if a user is an admin of any committee at all.
     */
    boolean existsByCommitteeAdmin(User user);

    /**
     * Checks if a user is an admin of any committee OTHER than the current one.
     */
    boolean existsByCommitteeAdminAndIdNot(User user, Long committeeId);

}