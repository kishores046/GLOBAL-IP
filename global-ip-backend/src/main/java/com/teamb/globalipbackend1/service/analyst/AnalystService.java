package com.teamb.globalipbackend1.service.analyst;

import com.teamb.globalipbackend1.dto.analyst.AnalystSearchResponse;
import com.teamb.globalipbackend1.dto.analyst.BasicStatisticsResponse;
import com.teamb.globalipbackend1.dto.analyst.TrendStatsResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnalystService {

   public Integer getAnalystSearchCount(String email){
       return 1;
   }
}

