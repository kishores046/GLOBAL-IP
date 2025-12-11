package com.teamb.globalipbackend1.service.admin;

import com.teamb.globalipbackend1.dto.authentication.UserDto;
import com.teamb.globalipbackend1.dto.user.UserProfileResponse;
import com.teamb.globalipbackend1.exception.ResourceNotFoundException;
import com.teamb.globalipbackend1.model.Role;
import com.teamb.globalipbackend1.model.User;
import com.teamb.globalipbackend1.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service @AllArgsConstructor
public class AdminService {
    private final UserRepository userRepository;

    public Page<@NonNull UserDto> getAllUsers(int page,int size){
        Pageable pageable= PageRequest.of(page,size, Sort.by("createAt").descending());
       Page<@NonNull User> users=userRepository.findAll(pageable);
        return users.map(u -> new UserDto(
                u.getUsername(),
                u.getEmail(),
                u.getRoles(),    // multiple roles
                u.getCreatedAt(),
                u.getUpdatedAt()
        ));
    }

    @Transactional
    public UserDto changeUserRoles(String userId, Set<Role> newRoles) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        user.setRoles(newRoles);  // overwrite OR

        return UserDto.toResponse(userRepository.save(user));
    }

    public List<UserProfileResponse> listUsers() {
        return userRepository.findAll().stream()
                .map(u -> new UserProfileResponse(
                        u.getUsername(),
                        u.getEmail(),
                        u.getRoles().stream().map(Role::getRoleType).collect(Collectors.toSet()),
                        u.getPhoneNumber(),
                        u.getCompany(),
                        u.getLocation(),
                        u.getPosition(),
                        u.getBio()
                ))
                .toList();
    }

    @Transactional
    public void deleteUser(String userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        userRepository.deleteById(userId);
    }

}
