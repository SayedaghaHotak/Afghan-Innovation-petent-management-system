package innoandpatentms.iapms.entity;

import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "committees")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Committee {

    @OneToOne
    @JoinColumn(name = "admin_id")
    private User committeeAdmin;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
    @JoinTable(
        name = "committee_members",
        joinColumns = @JoinColumn(name = "committee_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> members = new ArrayList<>();

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
            if (user.getCommittees() != null && !user.getCommittees().contains(this)) {
                user.getCommittees().add(this);
            }
        }
    }
}