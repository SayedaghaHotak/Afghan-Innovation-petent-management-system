package innoandpatentms.iapms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import innoandpatentms.iapms.entity.Notification;
import innoandpatentms.iapms.entity.User;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    /**
     * Fetches all notifications for a specific user, newest first.
     * Used to populate the 'Notification Area' in the user profile.
     */
    List<Notification> findByUserOrderByCreatedAtDesc(User user);

    /**
     * Counts unread notifications to show a red badge/counter on the UI.
     */
    long countByUserAndIsReadFalse(User user);
}