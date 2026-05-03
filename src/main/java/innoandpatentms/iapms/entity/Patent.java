package innoandpatentms.iapms.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
<<<<<<< HEAD
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
=======
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
<<<<<<< HEAD
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
=======
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entity representing a Patent submission.
 * Updated to support file metadata for PDF, Image, and Video uploads.
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "patents")
<<<<<<< HEAD
@EntityListeners(AuditingEntityListener.class)
=======
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
public class Patent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    
<<<<<<< HEAD
    @Column(length = 2000)
    private String description;
    private String category;
    @ManyToOne
    private User innovator;


    //  for Initializing it with Status.PENDING default status when a new patent is created, so that it can be reviewed by the committee.
    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    // Timestamps for auditing purposes
=======
    @Column(length = 2000) // Increased length for detailed project descriptions
    private String description;
    
    private String category;

    // Default status set to PENDING
    private String status = "PENDING";

    // Timestamps for auditing purposes

>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
    @CreatedDate
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    /**
     * Track when profile/password was last changed.
     */
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // --- NEW FILE HANDLING FEATURES ---
    
    /**
<<<<<<< HEAD
     * The absolute path where the file is stored on our local computer.
     * e.g., "C:/iapms_system/uploads/1714123456_project.mp4"
     */
    private String attachmentPath;
=======
     * The absolute path where the file is stored on your local computer.
     * e.g., "C:/iapms_system/uploads/1714123456_project.mp4"
     */
    private String attachmentPath; 
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b

    /**
     * The original name of the file uploaded by the user.
     * e.g., "final_year_proposal.pdf"
     */
    private String originalFileName;

    /**
     * Stores the MIME type to help the frontend identify how to display the file.
     * e.g., "application/pdf", "image/jpeg", or "video/mp4"
     */
    private String fileType;

    // ----------------------------------

    @Column(length = 1000)
    private String reviewerFeedback;

    /**
     * The Innovator who owns this patent.
     * JsonIgnore prevents the user data from nesting infinitely in API responses.
     */
    @ManyToOne
    @JoinColumn(name = "user_id")
<<<<<<< HEAD
    @JsonIgnore
=======
    @JsonIgnore 
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
    private User user;

    /**
     * The Committee (Group) assigned to review this patent.
     * This matches 'findByAssignedCommitteeIn' in your repository.
     */
    @ManyToOne
    @JoinColumn(name = "committee_id")
    private Committee assignedCommittee;

    /**
     * To remember that this patent is resubmitted after changes, 
     * so that reviewers can be notified to re-review it.
     */
<<<<<<< HEAD
    private boolean resubmitted = false;

=======
    private boolean isResubmitted = false;
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
}