package com.modelforge.api_service.apikey.service;

import com.modelforge.api_service.apikey.dto.ApiKeyResponse;
import com.modelforge.api_service.apikey.entity.ApiKey;
import com.modelforge.api_service.apikey.repository.ApiKeyRepository;
import com.modelforge.api_service.model.entity.Model;
import com.modelforge.api_service.model.repository.ModelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.List;
import java.util.UUID;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApiKeyService {

    private final ApiKeyRepository apiKeyRepository;
    private final ModelRepository modelRepository;

    @Transactional
    public ApiKeyResponse generateKey(String email, UUID modelId, String label) {
        Model model = modelRepository.findById(modelId)
                .orElseThrow(() -> new RuntimeException("Model not found"));

        // Generate a secure random key with prefix
        String rawKey = "mf_" + generateSecureString();

        // Hash it for storage
        String keyHash = hashKey(rawKey);

        ApiKey apiKey = ApiKey.builder()
                .model(model)
                .keyHash(keyHash)
                .label(label != null ? label : "Default")
                .isActive(true)
                .build();

        apiKeyRepository.save(apiKey);

        // Return raw key — this is the ONLY time it's visible
        return ApiKeyResponse.builder()
                .id(apiKey.getId())
                .modelId(modelId)
                .label(apiKey.getLabel())
                .rawKey(rawKey)
                .isActive(true)
                .createdAt(apiKey.getCreatedAt())
                .build();
    }

    public List<ApiKeyResponse> getKeysForModel(UUID modelId) {
        return apiKeyRepository.findByModelIdOrderByCreatedAtDesc(modelId)
                .stream()
                .map(k -> ApiKeyResponse.builder()
                        .id(k.getId())
                        .modelId(modelId)
                        .label(k.getLabel())
                        .rawKey(null)   // never return raw key again
                        .isActive(k.isActive())
                        .lastUsedAt(k.getLastUsedAt())
                        .createdAt(k.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public void revokeKey(UUID keyId) {
        ApiKey key = apiKeyRepository.findById(keyId)
                .orElseThrow(() -> new RuntimeException("API key not found"));
        key.setActive(false);
        apiKeyRepository.save(key);
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