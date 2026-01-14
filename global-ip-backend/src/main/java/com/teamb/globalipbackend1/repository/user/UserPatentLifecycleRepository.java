package com.teamb.globalipbackend1.repository.user;

import com.teamb.globalipbackend1.model.lifecycle.UserPatentLifecycle;
import com.teamb.globalipbackend1.model.lifecycle.UserPatentLifecycleId;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserPatentLifecycleRepository
        extends JpaRepository<@NonNull UserPatentLifecycle, @NonNull UserPatentLifecycleId> {

    List<UserPatentLifecycle> findByIdUserId(String  userId);
}
