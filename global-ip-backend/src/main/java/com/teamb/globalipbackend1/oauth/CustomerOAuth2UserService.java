package com.teamb.globalipbackend1.oauth;

import com.teamb.globalipbackend1.model.Role;
import com.teamb.globalipbackend1.model.User;
import com.teamb.globalipbackend1.repository.RoleRepository;
import com.teamb.globalipbackend1.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class CustomerOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepo;
    private final RoleRepository roleRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest request) throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(request);

        String provider = request.getClientRegistration().getRegistrationId();
        OAuth2UserInfo info = OAuth2UserInfoFactory.get(provider, oAuth2User.getAttributes());

        if (info.getEmail() == null)
            throw new OAuth2AuthenticationException("Email not found from OAuth provider");

        Role role = roleRepository.findByRoleType("USER")
                .orElseGet(() -> {
                    Role newRole = new Role("USER");
                    return roleRepository.save(newRole);
                });
        // Check if exists
        User user = userRepo.findByEmail(info.getEmail()).orElseGet(() -> {
            // register new user
            User newUser = new User();
            newUser.setEmail(info.getEmail());
            newUser.setUsername(info.getName());
            newUser.setRoles(Set.of(role));
            return userRepo.save(newUser);
        });


        user.setUsername(info.getName());
        userRepo.save(user);

        return new CustomOAuth2User(user, oAuth2User.getAttributes());
    }
}
