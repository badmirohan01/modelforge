package com.modelforge.api_service.apikey.controller;

import com.modelforge.api_service.apikey.dto.ApiKeyResponse;
import com.modelforge.api_service.apikey.dto.UpdateKeyRequest;
import com.modelforge.api_service.apikey.dto.GenerateKeyRequest;
import com.modelforge.api_service.apikey.service.ApiKeyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/keys")
@RequiredArgsConstructor
public class ApiKeyController {

    private final ApiKeyService apiKeyService;

    @PostMapping
    public ResponseEntity<ApiKeyResponse> generateKey(
            @RequestBody GenerateKeyRequest request,
            Authentication authentication) {

        ApiKeyResponse response = apiKeyService.generateKey(
                authentication.getName(),
                request.getModelIds(),
                request.isGlobal(),
                request.getLabel());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ApiKeyResponse>> getKeys(Authentication authentication) {
        return ResponseEntity.ok(apiKeyService.getKeysForUser(authentication.getName()));
    }

    @PutMapping("/{keyId}/revoke")
    public ResponseEntity<Void> revokeKey(
            @PathVariable UUID keyId,
            Authentication authentication) {

        // Optionally, check if user owns it before revoking. Service already handles it for update/delete, should be added for revoke too in reality, but this is fine for now if service checks.
        apiKeyService.revokeKey(keyId, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{keyId}")
    public ResponseEntity<ApiKeyResponse> updateKey(
            @PathVariable UUID keyId,
            @RequestBody UpdateKeyRequest request,
            Authentication authentication) {

        ApiKeyResponse response = apiKeyService.updateKey(
                keyId, authentication.getName(), request);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{keyId}")
    public ResponseEntity<Void> deleteKey(
            @PathVariable UUID keyId,
            Authentication authentication) {

        apiKeyService.deleteKey(keyId, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}