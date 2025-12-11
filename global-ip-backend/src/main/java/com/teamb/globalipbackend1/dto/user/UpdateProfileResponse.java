package com.teamb.globalipbackend1.dto.user;

public record UpdateProfileResponse( String username,
                                     String phoneNumber,
                                     String location,
                                     String company,
                                     String position,
                                     String bio) {
}
