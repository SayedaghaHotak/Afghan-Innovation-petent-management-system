package innoandpatentms.iapms.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException ex) {
        String message = ex.getMessage();

        // 1. Resource Not Found (404)
        if (message.contains("not found")) {
            return new ResponseEntity<>(message, HttpStatus.NOT_FOUND);
        }

        // 2. Security/Permission Cases (403)
        if (message.contains("Unauthorized") || message.contains("Action Denied")) {
            return new ResponseEntity<>(message, HttpStatus.FORBIDDEN);
        }

        // 3. Validation or Logic Errors (400)
        // Added to handle custom logic errors like "Passwords do not match"
        if (message.contains("match") || message.contains("already in use") || message.contains("Cannot delete")) {
            return new ResponseEntity<>(message, HttpStatus.BAD_REQUEST);
        }
        
        // 4. Default Fallback (500)
        return new ResponseEntity<>("Internal Server Error: " + message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * Handles errors when Status.valueOf() fails (Invalid Enum strings)
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgument(IllegalArgumentException ex) {
        // This catches cases where the user sends an invalid status string to the Enum
        return new ResponseEntity<>("Invalid input provided: " + ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
}