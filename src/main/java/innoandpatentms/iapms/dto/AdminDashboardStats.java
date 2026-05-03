package innoandpatentms.iapms.dto;

import java.util.List;
import java.util.Map;

import lombok.Data;

@Data
public class AdminDashboardStats {
    private long totalPatents;
    private long approvedPatents;
    private long pendingPatents;
    private long rejectedPatents;
    private long totalInnovators;
    private List<Map<String, Object>> latestSubmissions;
    private Map<String, Long> patentsByMonth;
}