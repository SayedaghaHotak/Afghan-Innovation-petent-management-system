package innoandpatentms.iapms.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
<<<<<<< HEAD
import jakarta.persistence.JoinTable;
=======
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "users")
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class) // Critical for @CreatedDate
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "First name is required")
    @Pattern(regexp = "^[\\p{L}\\p{M}\\s'-]+$", message = "Invalid characters in first name")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Pattern(regexp = "^[\\p{L}\\p{M}\\s'-]+$", message = "Invalid characters in last name")
    private String lastName;

    @Column(unique = true, nullable = false)
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\+[0-9]{10,15}$", message = "Invalid phone number format (e.g. +1234567890)")
    private String phoneNumber;

    /**
     * Security: WRITE_ONLY ensures password isn't leaked in API responses.
     */
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @NotBlank(message = "Password is required")
    private String password;

    /**
     * EAGER fetch ensures roles are loaded for Spring Security immediately.
     * Initializing with HashSet avoids NullPointer on new objects.
     */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "roles")
    private Set<String> roles = new HashSet<>();

    /**
     * Track when the account was created.
     */
    @CreatedDate
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    /**
     * Track when profile/password was last changed.
     */
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * Relationship to Patents.
     * JsonIgnore prevents infinite recursion.
     */
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore 
    private List<Patent> patents = new ArrayList<>();

    /**
     * Relationship to Committees.
     */
    @ManyToMany(mappedBy = "members")
    @JsonIgnore 
    private List<Committee> committees = new ArrayList<>();

    /**
     * Helper Method: Combines first and last name.
     */
    @JsonProperty("fullName")
    public String getFullName() {
        return firstName + " " + lastName;
    }

<<<<<<< HEAD
    /*
=======
    /**
     * STRENGTHENED SETTER: 
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
     * Ensures roles are always stored Trimmed and Uppercase to match SecurityConfig.
     */
    public void setRoles(Set<String> roles) {
        if (roles != null) {
            this.roles = roles.stream()
                             .map(role -> role.trim().toUpperCase())
                             .collect(Collectors.toSet());
        }
    }
<<<<<<< HEAD

    @ManyToMany
    @JoinTable(
        name = "user_committees",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "committee_id")
    )
    private Set<Committee> committeesSet = new HashSet<>();
=======
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
}