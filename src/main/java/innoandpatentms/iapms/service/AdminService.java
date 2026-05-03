package innoandpatentms.iapms.service;

import java.time.Year;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import innoandpatentms.iapms.dto.AdminDashboardStats;
import innoandpatentms.iapms.entity.Status;
import innoandpatentms.iapms.repository.PatentRepository;
import innoandpatentms.iapms.repository.UserRepository;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final PatentRepository patentRepository;

    /**
     * Aggregates all data required for the Admin Dashboard.
     */
    public AdminDashboardStats getDashboardStats() {
        AdminDashboardStats stats = new AdminDashboardStats();
        
        // 1. Basic Stats using the synchronized Enum-based counts
        stats.setTotalPatents(patentRepository.count());
        stats.setApprovedPatents(patentRepository.countByStatus(Status.APPROVED));
        stats.setPendingPatents(patentRepository.countByStatus(Status.PENDING));
        stats.setRejectedPatents(patentRepository.countByStatus(Status.REJECTED));
                // Use the role-containing method from your UserRepository
                stats.setTotalInnovators(userRepository.countByRolesContaining("INNOVATOR"));

        // 2. Latest Submissions (Using Top 10 for a cleaner UI)
        stats.setLatestSubmissions(patentRepository.findTop10ByOrderByCreatedAtDesc()
            .stream().map(p -> {
                Map<String, Object> map = new HashMap<>(); 
                map.put("id", p.getId());
                map.put("title", p.getTitle());
                
                // Safe extraction of full name from the User entity
                String name = (p.getUser() != null) 
                    ? p.getUser().getFullName() 
                    : "Unknown Innovator";
                map.put("innovator", name);
                
                map.put("date", p.getCreatedAt());
                map.put("status", p.getStatus());
                return map;
            }).collect(Collectors.toList()));

        // 3. Analytics: Innovation in One Year (Bar Chart Data)
        int currentYear = Year.now().getValue();
        List<Object[]> monthlyData = patentRepository.countPatentsByMonth(currentYear);
        
        Map<String, Long> chartData = new LinkedHashMap<>();
        String[] monthNames = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};
        
        for (int i = 1; i <= 12; i++) {
            final int monthIdx = i;
            long count = monthlyData.stream()
                .filter(m -> ((Number) m[0]).intValue() == monthIdx)
                .map(m -> (Long) m[1])
                .findFirst().orElse(0L);
            chartData.put(monthNames[i-1], count);
        }
        stats.setPatentsByMonth(chartData);

        return stats;
    }
}