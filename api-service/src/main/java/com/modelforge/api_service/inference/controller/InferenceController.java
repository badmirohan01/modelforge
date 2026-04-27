package com.modelforge.api_service.inference.controller;

import com.modelforge.api_service.inference.dto.InferRequest;
import com.modelforge.api_service.inference.dto.InferResponse;
import com.modelforge.api_service.inference.service.InferenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.modelforge.api_service.inference.repository.InferenceLogRepository;

import java.util.UUID;

@RestController
@RequestMapping("/api/models")
@RequiredArgsConstructor
public class InferenceController {

    private final InferenceService inferenceService;
    private final InferenceLogRepository inferenceLogRepository;

    @PostMapping("/{modelId}/infer")
    public ResponseEntity<InferResponse> infer(
            @PathVariable UUID modelId,
            @RequestBody InferRequest request,
            Authentication authentication) {

        InferResponse response = inferenceService.infer(
                authentication.getName(), modelId, request);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{modelId}/logs")
    public ResponseEntity<?> getLogs(
            @PathVariable UUID modelId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication) {

        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);

        var logs = inferenceLogRepository.findByModelIdOrderByCalledAtDesc(modelId, pageable);
        return ResponseEntity.ok(logs);
    }
}