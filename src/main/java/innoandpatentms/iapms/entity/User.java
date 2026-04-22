package innoandpatentms.iapms.entity;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)// Auto-increment ID generation without gaps
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
    @Pattern(regexp = "\\+[0-9]{10,15}$", message = "Invalid phone number format")
    private String phoneNumber;

    // Security: WRITE_ONLY ensures password isn't leaked in JSON responses
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @NotBlank(message = "Password is required")
    private String password;

    // EAGER fetch ensures roles are loaded immediately for Security checks
    @ElementCollection(fetch = FetchType.EAGER)
    private Set<String> roles;

    // Relationship to Patents (One User has Many Patents)
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore // Prevents infinite recursion in JSON
    private List<Patent> patents = new ArrayList<>();

    // Relationship to Committees (A Reviewer can be in multiple Committees)
    @ManyToMany(mappedBy = "members")
    @JsonIgnore // Prevents loop when viewing Committee members
    private List<Committee> committees = new ArrayList<>();

    public void setRoles(Set<String> roles) {
    this.roles = roles.stream()
                      .map(String::toUpperCase)
                      .collect(Collectors.toSet());
}
}