package innoandpatentms.iapms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import innoandpatentms.iapms.entity.Committee;
import innoandpatentms.iapms.entity.Patent;
import innoandpatentms.iapms.entity.Status;
import innoandpatentms.iapms.entity.User;

/**
 * Repository interface for Patent database operations.
 * This interface acts as the bridge between your Java code and the PostgreSQL database.
 */
@Repository
public interface PatentRepository extends JpaRepository<Patent, Long> {

    /**
     * INNOVATOR FEATURE:
     * Retrieves all patents submitted by a specific user.
     * Used for the "My Patents" dashboard section.
     */
    List<Patent> findByUser(User user);

    /**
     * SYSTEM FEATURE:
     * Filters patents by their workflow status using a String (e.g., "PENDING").
     */
    List<Patent> findByStatus(Status status);

    long countByStatus(Status status);
    /**
     * ADMIN FEATURE:
     * Finds patents linked to a specific committee. 
     * Useful for checking if a committee can be safely deleted.
     */
    List<Patent> findByAssignedCommittee(Committee committee);

    /**
     * COMMITTEE/REVIEWER FEATURE:
     * Finds all patents assigned to a list of committees.
     * This is used to populate the reviewer's inbox based on their memberships.
     */
    List<Patent> findByAssignedCommitteeIn(List<Committee> committees);

    /**
     * SEARCH FEATURE:
     * Performs a global search across titles and descriptions.
     * 'IgnoreCase' ensures that searching for "Solar" finds "solar" or "SOLAR".
     */
    List<Patent> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description);

    /**
     * CATEGORY FILTER:
     * Finds patents within a specific scientific or technical category.
     */
    List<Patent> findByCategory(String category);

    /**
     * FILE MANAGEMENT:
     * Filters patents by file type (e.g., "application/pdf").
     * Helps the system handle different file viewing requirements.
     */
    List<Patent> findByFileType(String fileType);

    /**
     * SECURITY CHECK:
     * Verifies that a specific patent belongs to a specific user.
     * Prevents users from accessing or deleting records they don't own.
     */
    boolean existsByIdAndUser(Long id, User user);

    /**
     * WORKFLOW TRACKING:
     * Retrieves patents that have been resubmitted after changes.
     */
    List<Patent> findByResubmittedTrue();

    // --- DASHBOARD CARD QUERIES ---

    /** 
     * Custom query to count only 'APPROVED' patents.
     */
    @Query("SELECT COUNT(p) FROM Patent p WHERE p.status = 'APPROVED'")
    long countByStatusApproved();
    
    /** 
     * Custom query to count only 'PENDING' patents.
     */
    @Query("SELECT COUNT(p) FROM Patent p WHERE p.status = 'PENDING'")
    long countByStatusPending();
    
    /** 
     * Custom query to count only 'REJECTED' patents.
     */
    @Query("SELECT COUNT(p) FROM Patent p WHERE p.status = 'REJECTED'")
    long countByStatusRejected();

        /** 
        * Custom query to count only 'REQUEST_MODIFICATION' patents.
        */ 
    @Query("SELECT COUNT(p) FROM Patent p WHERE p.status = 'REQUEST_MODIFICATION'")
    long countByStatusRequestModification();

    // --- LATEST SUBMISSIONS & ANALYTICS ---

    /** 
     * Retrieves the 10 most recent submissions for the Admin Dashboard table.
     * Sorted by the 'createdAt' timestamp in descending order.
     */
    List<Patent> findTop10ByOrderByCreatedAtDesc(); 

    /** 
     * ANALYTICS QUERY:
     * Extracts the month and count of patents for a specific year.
     * Used to generate the "Innovation in one Year" bar chart.
     */
    @Query("SELECT EXTRACT(MONTH FROM p.createdAt) as month, COUNT(p) as count " +
           "FROM Patent p WHERE EXTRACT(YEAR FROM p.createdAt) = :year " +
           "GROUP BY EXTRACT(MONTH FROM p.createdAt)")
    List<Object[]> countPatentsByMonth(@Param("year") int year); 
}