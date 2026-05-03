package innoandpatentms.iapms.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import innoandpatentms.iapms.entity.Notification;
import innoandpatentms.iapms.entity.User;
import innoandpatentms.iapms.repository.NotificationRepository;
import innoandpatentms.iapms.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    /**
     * GET /api/notifications
     * Retrieves all notifications for the currently logged-in user.
     */
    @GetMapping
    public ResponseEntity<List<Notification>> getUserNotifications(Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return ResponseEntity.ok(notificationRepository.findByUserOrderByCreatedAtDesc(user));
    }

    /**
     * PUT /api/notifications/{id}/read
     * Marks a specific notification as read so it disappears from the 'new' alerts.
     */
    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        // This will now work without error
        notification.setRead(true); 
        
        notificationRepository.save(notification);
        return ResponseEntity.ok().build();
    }
}