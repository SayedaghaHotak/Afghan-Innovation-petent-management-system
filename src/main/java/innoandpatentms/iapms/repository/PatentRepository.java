package innoandpatentms.iapms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import innoandpatentms.iapms.entity.Patent;

public interface PatentRepository extends JpaRepository<Patent, Long> {
    List<Patent> findByUserEmail(String email);
}
