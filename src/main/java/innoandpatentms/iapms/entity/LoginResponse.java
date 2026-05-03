package innoandpatentms.iapms.entity;

import java.util.Map;
import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private String token;
    private String firstName;
    private String lastName;
    private String email;
    private Set<String> roles;
    private Set<String> committees; 
    private Map<String, Object> extraInfo;
    /**
     * Quick metrics for the user dashboard.
     * Example: {"pendingPatents": 2, "approvedPatents": 5}
     */
    private Map<String, Object> dashboardSummary;
}