<<<<<<< HEAD
=======

>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
package innoandpatentms.iapms.entity;

import java.util.ArrayList;
import java.util.List;
<<<<<<< HEAD
import jakarta.persistence.*;
=======

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "committees")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Committee {

<<<<<<< HEAD
    @OneToOne
    @JoinColumn(name = "admin_id")
    private User committeeAdmin;

=======
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;

<<<<<<< HEAD
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
=======
    /**
     * Added CascadeType.PERSIST and MERGE to ensure relationship sync.
     * Added FetchType.LAZY for better performance.
     */
    @ManyToMany(cascade = {jakarta.persistence.CascadeType.PERSIST, jakarta.persistence.CascadeType.MERGE},
        fetch = jakarta.persistence.FetchType.LAZY)
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
    @JoinTable(
        name = "committee_members",
        joinColumns = @JoinColumn(name = "committee_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> members = new ArrayList<>();

<<<<<<< HEAD
    /**
     * Utility method to sync bidirectional relationship.
     */
    public void addMember(User user) {
        if (this.members == null) {
            this.members = new ArrayList<>();
        }
        if (!this.members.contains(user)) {
            this.members.add(user);
            // Ensure the User side also knows about this committee
=======
        public void addMember(User user) {
        if (this.members == null) {
            this.members = new ArrayList<>();
        }
        // Only add if the user isn't already a member
        if (!this.members.contains(user)) {
            this.members.add(user);
            // Ensure User side is updated
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
            if (user.getCommittees() != null && !user.getCommittees().contains(this)) {
                user.getCommittees().add(this);
            }
        }
    }
}