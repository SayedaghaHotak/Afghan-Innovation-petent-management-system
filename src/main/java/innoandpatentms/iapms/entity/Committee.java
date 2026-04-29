
package innoandpatentms.iapms.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "committees")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Committee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;

    /**
     * Added CascadeType.PERSIST and MERGE to ensure relationship sync.
     * Added FetchType.LAZY for better performance.
     */
    @ManyToMany(cascade = {jakarta.persistence.CascadeType.PERSIST, jakarta.persistence.CascadeType.MERGE},
        fetch = jakarta.persistence.FetchType.LAZY)
    @JoinTable(
        name = "committee_members",
        joinColumns = @JoinColumn(name = "committee_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> members = new ArrayList<>();

        public void addMember(User user) {
        if (this.members == null) {
            this.members = new ArrayList<>();
        }
        // Only add if the user isn't already a member
        if (!this.members.contains(user)) {
            this.members.add(user);
            // Ensure User side is updated
            if (user.getCommittees() != null && !user.getCommittees().contains(this)) {
                user.getCommittees().add(this);
            }
        }
    }
}