package innoandpatentms.iapms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
<<<<<<< HEAD
import org.springframework.data.repository.query.Param;
=======
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
import org.springframework.stereotype.Repository;

import innoandpatentms.iapms.entity.Committee;
import innoandpatentms.iapms.entity.Patent;
<<<<<<< HEAD
import innoandpatentms.iapms.entity.Status;
=======
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
import innoandpatentms.iapms.entity.User;

/**
 * Repository interface for Patent database operations.
<<<<<<< HEAD
 * This interface acts as the bridge between your Java code and the PostgreSQL database.
=======
 * Handles the logic for Innovators, Reviewers, and Admins.
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
 */
@Repository
public interface PatentRepository extends JpaRepository<Patent, Long> {

    /**
     * INNOVATOR FEATURE:
     * Retrieves all patents submitted by a specific user.
<<<<<<< HEAD
     * Used for the "My Patents" dashboard section.
=======
     * Used for the "My Patents" section.
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
     */
    List<Patent> findByUser(User user);

    /**
<<<<<<< HEAD
     * SYSTEM FEATURE:
     * Filters patents by their workflow status using a String (e.g., "PENDING").
     */
    List<Patent> findByStatus(Status status);

    long countByStatus(Status status);
    /**
     * ADMIN FEATURE:
     * Finds patents linked to a specific committee. 
     * Useful for checking if a committee can be safely deleted.
=======
     * ADMIN/SYSTEM FEATURE:
     * Filters patents by their current workflow status (e.g., PENDING, APPROVED).
     */
    List<Patent> findByStatus(String status);

    /**
     * DELETE SAFETY CHECK:
     * Finds patents assigned to a specific committee.
     * Used in AdminController to block committee deletion if patents are linked.
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
     */
    List<Patent> findByAssignedCommittee(Committee committee);

    /**
<<<<<<< HEAD
     * COMMITTEE/REVIEWER FEATURE:
     * Finds all patents assigned to a list of committees.
     * This is used to populate the reviewer's inbox based on their memberships.
=======
     * REVIEWER FEATURE:
     * Finds all patents assigned to any of the committees the reviewer belongs to.
     * This is the "Inbox" logic for reviewers.
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
     */
    List<Patent> findByAssignedCommitteeIn(List<Committee> committees);

    /**
     * SEARCH FEATURE:
<<<<<<< HEAD
     * Performs a global search across titles and descriptions.
     * 'IgnoreCase' ensures that searching for "Solar" finds "solar" or "SOLAR".
=======
     * Keyword search in title or description (Case-Insensitive).
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
     */
    List<Patent> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description);

    /**
     * CATEGORY FILTER:
<<<<<<< HEAD
     * Finds patents within a specific scientific or technical category.
=======
     * Finds patents within a specific category (e.g., "Software").
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
     */
    List<Patent> findByCategory(String category);

    /**
<<<<<<< HEAD
     * FILE MANAGEMENT:
     * Filters patents by file type (e.g., "application/pdf").
     * Helps the system handle different file viewing requirements.
=======
     * FILE MANAGEMENT FEATURE:
     * Finds patents by file type (e.g., application/pdf).
     * Useful if you want to filter by "Videos only" or "Documents only".
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
     */
    List<Patent> findByFileType(String fileType);

    /**
     * SECURITY CHECK:
<<<<<<< HEAD
     * Verifies that a specific patent belongs to a specific user.
     * Prevents users from accessing or deleting records they don't own.
=======
     * Checks if a patent exists and belongs to a specific user.
     * Essential for ensuring users don't delete other people's patents.
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
     */
    boolean existsByIdAndUser(Long id, User user);

    /**
<<<<<<< HEAD
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
=======
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
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
}