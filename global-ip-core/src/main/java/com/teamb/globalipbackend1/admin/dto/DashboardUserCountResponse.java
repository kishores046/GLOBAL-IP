package com.teamb.globalipbackend1.admin.dto;



public record DashboardUserCountResponse(
        long totalUsers,
        long activeUsers,
        long inactiveUsers
) {}
