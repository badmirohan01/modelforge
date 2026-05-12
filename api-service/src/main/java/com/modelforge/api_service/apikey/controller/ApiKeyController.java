package com.modelforge.api_service.apikey.controller;

import com.modelforge.api_service.apikey.dto.ApiKeyResponse;
import com.modelforge.api_service.apikey.service.ApiKeyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/models")
@RequiredArgsConstructor
public class ApiKeyController {

    private final ApiKeyService apiKeyService;

    @PostMapping("/{modelId}/keys")
    public ResponseEntity<ApiKeyResponse> generateKey(
            @PathVariable UUID modelId,
            @RequestParam(defaultValue = "Default") String label,
            Authentication authentication) {

        ApiKeyResponse response = apiKeyService.generateKey(
                authentication.getName(), modelId, label);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{modelId}/keys")
    public ResponseEntity<List<ApiKeyResponse>> getKeys(
            @PathVariable UUID modelId,
            Authentication authentication) {

        return ResponseEntity.ok(apiKeyService.getKeysForModel(modelId));
    }

    @PutMapping

    @DeleteMapping("/{modelId}/keys/{keyId}")
    public ResponseEntity<Void> revokeKey(
            @PathVariable UUID modelId,
            @PathVariable UUID keyId,
            Authentication authentication) {

        apiKeyService.revokeKey(keyId);
        return ResponseEntity.noContent().build();
    }
}