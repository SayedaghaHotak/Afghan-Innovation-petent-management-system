package innoandpatentms.iapms.service;

import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import innoandpatentms.iapms.entity.Notification;
import innoandpatentms.iapms.entity.User;
import innoandpatentms.iapms.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final JavaMailSender mailSender;

    public String sendStatusUpdate(User user, String patentTitle, String newStatus) {
        String message = "Your patent '" + patentTitle + "' status has been updated to: " + newStatus;

        // 1. Save to Database for Profile Area
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
        notificationRepository.save(notification);

        // 2. Send Email
        try {
            SimpleMailMessage email = new SimpleMailMessage();
            email.setTo(user.getEmail());
            email.setSubject("IAPMS: Patent Status Update");
            email.setText("Hello " + user.getFirstName() + ",\n\n" + message);
            mailSender.send(email);
        } catch (MailException e) {
            // Log the error but don't stop the system if email fails
            log.error("Email failed to send: " + e.getMessage());
            return "Failed to send email notification.";
        }
        return "Notification sent successfully.";
    }
}