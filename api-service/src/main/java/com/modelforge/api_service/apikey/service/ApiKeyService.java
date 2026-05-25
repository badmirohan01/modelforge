package com.modelforge.api_service.apikey.service;

import com.modelforge.api_service.apikey.dto.ApiKeyResponse;
import com.modelforge.api_service.apikey.dto.UpdateKeyRequest;
import com.modelforge.api_service.apikey.entity.ApiKey;
import com.modelforge.api_service.apikey.repository.ApiKeyRepository;
import com.modelforge.api_service.exception.ModelNotFoundException;
import com.modelforge.api_service.model.entity.Model;
import com.modelforge.api_service.auth.entity.User;
import com.modelforge.api_service.auth.repository.UserRepository;
import com.modelforge.api_service.model.repository.ModelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.HashSet;
import java.util.List;
import java.util.UUID;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ApiKeyService {

    private final ApiKeyRepository apiKeyRepository;
    private final ModelRepository modelRepository;
    private final UserRepository userRepository;

    @Transactional
    public ApiKeyResponse generateKey(String email,
            List<UUID> modelIds,
            boolean isGlobal,
            String label) {

        User owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String rawKey = "mf_" + generateSecureString();
        String keyHash = hashKey(rawKey);

        Set<Model> models = new HashSet<>();
        if (!isGlobal) {
            // fetch only the requested models that belong to this user
            models = modelIds.stream()
                    .map(id -> modelRepository.findById(id)
                            .orElseThrow(() -> new ModelNotFoundException(id.toString())))
                    .collect(Collectors.toSet());
        }

        ApiKey apiKey = ApiKey.builder()
                .owner(owner)
                .keyHash(keyHash)
                .label(label != null ? label : "Default")
                .models(models)
                .isGlobal(isGlobal)
                .isActive(true)
                .build();

        apiKeyRepository.save(apiKey);

        return ApiKeyResponse.builder()
                .id(apiKey.getId())
                .modelIds(modelIds)
                .isGlobal(isGlobal)
                .label(apiKey.getLabel())
                .rawKey(rawKey)
                .isActive(true)
                .createdAt(apiKey.getCreatedAt())
                .build();
    }

    public List<ApiKeyResponse> getKeysForUser(String email) {
        return apiKeyRepository.findByOwnerEmailOrderByCreatedAtDesc(email)
                .stream()
                .map(k -> ApiKeyResponse.builder()
                        .id(k.getId())
                        .modelIds(k.getModels().stream().map(Model::getId).collect(Collectors.toList()))
                        .isGlobal(k.isGlobal())
                        .label(k.getLabel())
                        .rawKey(null) // never return raw key again
                        .isActive(k.isActive())
                        .lastUsedAt(k.getLastUsedAt())
                        .createdAt(k.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    public List<ApiKeyResponse> getKeysForModel(UUID modelId) {
        return apiKeyRepository.findByModelIdOrderByCreatedAtDesc(modelId)
                .stream()
                .map(k -> ApiKeyResponse.builder()
                        .id(k.getId())
                        .modelIds(k.getModels().stream().map(Model::getId).collect(Collectors.toList()))
                        .isGlobal(k.isGlobal())
                        .label(k.getLabel())
                        .rawKey(null) // never return raw key again
                        .isActive(k.isActive())
                        .lastUsedAt(k.getLastUsedAt())
                        .createdAt(k.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public void revokeKey(UUID keyId, String email) {
        ApiKey key = apiKeyRepository.findById(keyId)
                .orElseThrow(() -> new RuntimeException("API key not found"));
                
        if (!key.getOwner().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized");
        }
        
        key.setActive(false);
        apiKeyRepository.save(key);
    }

    @Transactional
    public ApiKeyResponse updateKey(UUID keyId, String email, UpdateKeyRequest request) {
        ApiKey key = apiKeyRepository.findById(keyId)
                .orElseThrow(() -> new RuntimeException("API key not found"));

        // make sure the key belongs to the requesting user
        if (!key.getOwner().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized");
        }

        if (request.getLabel() != null && !request.getLabel().isBlank()) {
            key.setLabel(request.getLabel());
        }

        apiKeyRepository.save(key);

        return ApiKeyResponse.builder()
                .id(key.getId())
                .label(key.getLabel())
                .isGlobal(key.isGlobal())
                .modelIds(key.getModels().stream()
                        .map(m -> m.getId())
                        .collect(java.util.stream.Collectors.toList()))
                .isActive(key.isActive())
                .rawKey(null)
                .lastUsedAt(key.getLastUsedAt())
                .createdAt(key.getCreatedAt())
                .build();
    }

    @Transactional
    public void deleteKey(UUID keyId, String email) {
        ApiKey key = apiKeyRepository.findById(keyId)
                .orElseThrow(() -> new RuntimeException("API key not found"));

        if (!key.getOwner().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized");
        }

        apiKeyRepository.delete(key);
    }

    public Optional<ApiKey> validateKey(String rawKey) {
        String keyHash = hashKey(rawKey);
        return apiKeyRepository.findByKeyHashAndIsActiveTrue(keyHash);
    }

    private String generateSecureString() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    public String hashKey(String rawKey) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(rawKey.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (Exception e) {
            throw new RuntimeException("Failed to hash key");
        }
    }
}