package innoandpatentms.iapms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import innoandpatentms.iapms.entity.Committee;

@Repository
public interface CommitteeRepository extends JpaRepository<Committee, Long> {
    // This allows the AdminController to save and find committees
}