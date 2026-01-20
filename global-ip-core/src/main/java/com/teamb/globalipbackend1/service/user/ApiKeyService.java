package com.teamb.globalipbackend1.service.user;

import com.teamb.globalipbackend1.exception.ApiKeyCreationFailureException;
import com.teamb.globalipbackend1.exception.NoApiKeyFoundException;
import com.teamb.globalipbackend1.model.user.ApiKey;
import com.teamb.globalipbackend1.model.user.ApiKeyStatus;
import com.teamb.globalipbackend1.model.user.User;
import com.teamb.globalipbackend1.repository.user.ApiKeyRepository;
import com.teamb.globalipbackend1.repository.user.UserRepository;
import com.teamb.globalipbackend1.security.MyUserDetails;
import com.teamb.globalipbackend1.util.apikey.ApiKeyGenerator;
import com.teamb.globalipbackend1.util.apikey.ApiKeyHasher;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ApiKeyService {

    private final ApiKeyRepository repository;
    private final ApiKeyGenerator generator;
    private final ApiKeyHasher hasher;
    private final UserRepository userRepository;

    /* CREATE */
    public CreatedApiKey create(Authentication authentication) {

        String rawKey = generator.generate();


        MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
        if (userDetails != null) {
            User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new UsernameNotFoundException("No user found by this email"));
            ApiKey key = new ApiKey();
            key.setUserId(user.getUser_id());
            key.setName(user.getUsername());
            key.setKeyHash(hasher.hash(rawKey));
            key.setKeyPrefix(rawKey.substring(0, 6));
            key.setStatus(ApiKeyStatus.ACTIVE);
            key.setCreatedAt(LocalDateTime.now());

            repository.save(key);

            return new CreatedApiKey(rawKey);
        }

        throw new ApiKeyCreationFailureException("Can't create the api key");

    }

    /* LIST */
    public List<ApiKey> list(Authentication authentication) {

        MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
        if (userDetails != null) {
            User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new UsernameNotFoundException("No user found by this email"));
            return repository.findByUserId(user.getUser_id());
        }
        throw new NoApiKeyFoundException("No api key found for the user");
    }

    /* REVOKE */
    public void revoke(Long keyId, Authentication authentication) {

        MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
        if (userDetails != null) {
            User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new UsernameNotFoundException("No user found by this email"));
            ApiKey key = repository.findByIdAndUserId(keyId, user.getUser_id())
                    .orElseThrow(() -> new RuntimeException("KEY_NOT_FOUND"));

            key.setStatus(ApiKeyStatus.REVOKED);
        }


    }

    /* VALIDATE (runtime auth) */
    public ApiKey validate(String rawKey) {
        return repository.findAll().stream()
                .filter(k -> k.getStatus() == ApiKeyStatus.ACTIVE)
                .filter(k -> hasher.matches(rawKey, k.getKeyHash()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("INVALID_API_KEY"));
    }

    @Transactional(readOnly = true)
    public Page<@NonNull ApiKey> listAllForAdmin(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Transactional
    public void adminRevoke(Long keyId) {
        ApiKey key = repository.findById(keyId)
                .orElseThrow(() -> new RuntimeException("KEY_NOT_FOUND"));

        key.setStatus(ApiKeyStatus.REVOKED);
    }
}