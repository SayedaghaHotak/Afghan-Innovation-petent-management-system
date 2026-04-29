package innoandpatentms.iapms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import innoandpatentms.iapms.entity.Committee;
import innoandpatentms.iapms.entity.Patent;
import innoandpatentms.iapms.entity.User;

/**
 * Repository interface for Patent database operations.
 * Handles the logic for Innovators, Reviewers, and Admins.
 */
@Repository
public interface PatentRepository extends JpaRepository<Patent, Long> {

    /**
     * INNOVATOR FEATURE:
     * Retrieves all patents submitted by a specific user.
     * Used for the "My Patents" section.
     */
    List<Patent> findByUser(User user);

    /**
     * ADMIN/SYSTEM FEATURE:
     * Filters patents by their current workflow status (e.g., PENDING, APPROVED).
     */
    List<Patent> findByStatus(String status);

    /**
     * DELETE SAFETY CHECK:
     * Finds patents assigned to a specific committee.
     * Used in AdminController to block committee deletion if patents are linked.
     */
    List<Patent> findByAssignedCommittee(Committee committee);

    /**
     * REVIEWER FEATURE:
     * Finds all patents assigned to any of the committees the reviewer belongs to.
     * This is the "Inbox" logic for reviewers.
     */
    List<Patent> findByAssignedCommitteeIn(List<Committee> committees);

    /**
     * SEARCH FEATURE:
     * Keyword search in title or description (Case-Insensitive).
     */
    List<Patent> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description);

    /**
     * CATEGORY FILTER:
     * Finds patents within a specific category (e.g., "Software").
     */
    List<Patent> findByCategory(String category);

    /**
     * FILE MANAGEMENT FEATURE:
     * Finds patents by file type (e.g., application/pdf).
     * Useful if you want to filter by "Videos only" or "Documents only".
     */
    List<Patent> findByFileType(String fileType);

    /**
     * SECURITY CHECK:
     * Checks if a patent exists and belongs to a specific user.
     * Essential for ensuring users don't delete other people's patents.
     */
    boolean existsByIdAndUser(Long id, User user);

    /**
     * RESUBMISSION TRACKING:
     * Finds all patents that have been resubmitted after reviewer feedback.
     */
    List<Patent> findByIsResubmittedTrue();

    // --- DASHBOARD CARD QUERIES ---
    long count(); // Total Patents
    
    @Query("SELECT COUNT(p) FROM Patent p WHERE p.status = 'APPROVED'")
    long countByStatusApproved();
    
    @Query("SELECT COUNT(p) FROM Patent p WHERE p.status = 'PENDING'")
    long countByStatusPending();
    
    @Query("SELECT COUNT(p) FROM Patent p WHERE p.status = 'REJECTED'")
    long countByStatusRejected();

    // --- LATEST SUBMISSIONS TABLE ---
    // Returns the 5 most recent submissions
    List<Patent> findTop5ByOrderByCreatedAtDesc();
}