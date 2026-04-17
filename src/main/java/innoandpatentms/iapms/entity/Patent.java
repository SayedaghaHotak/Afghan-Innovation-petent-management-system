package innoandpatentms.iapms.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data
public class Patent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String category; // e.g., "Software", "Mechanical"
    private String status = "PENDING"; // Default status
    
    private String attachmentPath;  // Path to the uploaded file

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user; // The owner of the idea
}