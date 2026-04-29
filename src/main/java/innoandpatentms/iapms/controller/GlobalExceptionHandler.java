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

        // 1. Check for specific "Not Found" cases
        if (message.equals("Patent not found") || message.equals("Committee not found") || message.equals("User not found")) {
            return new ResponseEntity<>(message, HttpStatus.NOT_FOUND);
        }

        // 2. Check for Security/Permission cases
        if (message.contains("Unauthorized") || message.contains("Action Denied")) {
            return new ResponseEntity<>(message, HttpStatus.FORBIDDEN);
        }
        
        // 3. For any other unexpected errors, return a 500 status
        return new ResponseEntity<>(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}