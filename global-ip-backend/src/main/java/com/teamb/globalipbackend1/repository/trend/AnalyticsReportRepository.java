package com.teamb.globalipbackend1.repository.trend;




import com.teamb.globalipbackend1.model.trend.AnalyticsReport;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnalyticsReportRepository extends JpaRepository<@NonNull AnalyticsReport,@NonNull Long> {
    List<AnalyticsReport> findAllByOrderByGeneratedAtDesc();
    List<AnalyticsReport> findByReportYear(Integer year);
    List<AnalyticsReport> findByGeneratedBy(String username);
}