package innoandpatentms.iapms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import innoandpatentms.iapms.entity.Committee;
import innoandpatentms.iapms.entity.Patent;
import innoandpatentms.iapms.entity.User;

public interface PatentRepository extends JpaRepository<Patent, Long> {
    List<Patent> findByUser(User user);
    List<Patent> findByStatus(String status);

    // For Reviewer Dashboard: Find patents assigned to committees this user belongs to
    List<Patent> findByAssignedCommitteeIn( List<Committee> committees);
}
