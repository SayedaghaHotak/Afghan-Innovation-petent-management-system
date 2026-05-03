package innoandpatentms.iapms.entity;
<<<<<<< HEAD

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO for capturing login credentials.
 * Note: While in the 'entity' package here, this is technically a DTO.
 */
@Data
public class LoginRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    private String email;

    @NotBlank(message = "Password is required")
=======
import lombok.Data;
@Data
public class LoginRequest {
    private String email;
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
    private String password;
}