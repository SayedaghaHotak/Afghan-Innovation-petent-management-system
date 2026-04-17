package innoandpatentms.iapms.entity;

import java.util.Map;
import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String message; // "Login Successful"
    private String firstName;
    private Set<String> roles;
    
    // Summary of operations (e.g., {"pendingPatents": 2, "approvedPatents": 1})
    private Map<String, Object> dashboardSummary; 
}