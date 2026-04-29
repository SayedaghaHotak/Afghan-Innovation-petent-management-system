package innoandpatentms.iapms.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import innoandpatentms.iapms.entity.Committee;
import innoandpatentms.iapms.entity.User;

/**
 * Repository for Committee Entity.
 * This interface handles all database operations for the "WhatsApp-style" groups.
 */
@Repository
public interface CommitteeRepository extends JpaRepository<Committee, Long> {

    /**
     * CORE LOGIC: Finds all committees (groups) that a specific user has joined.
     * Used by the Reviewer Dashboard to determine which patents they are allowed to see.
     * * @param user The User object (usually the logged-in reviewer)
     * @return A list of Committees this user belongs to.
     */
    List<Committee> findByMembersContaining(User user);

    /**
     * Finds a committee by its unique name.
     * Useful for checking if a group name already exists before creating a new one.
     */
    Optional<Committee> findByName(String name);

    /**
     * Search for committees based on their category (e.g., "Software", "Medical").
     * Helps the Admin organize groups by department.
     */
    List<Committee> findByDescriptionContainingIgnoreCase(String keyword);

    /**
     * Checks if a specific user is already a member of a specific committee.
     * Useful for preventing duplicate additions to the same group.
     */
    boolean existsByIdAndMembersContaining(Long committeeId, User user);

    // Custom query to find a committee by name regardless of upper/lower case
    Optional<Committee> findByNameIgnoreCase(String name);
}