package com.modelforge.api_service.inference.service;

import com.modelforge.api_service.inference.dto.InferRequest;
import com.modelforge.api_service.inference.dto.InferResponse;
import com.modelforge.api_service.inference.entity.InferenceLog;
import com.modelforge.api_service.inference.repository.InferenceLogRepository;
import com.modelforge.api_service.model.entity.Model;
import com.modelforge.api_service.model.entity.ModelVersion;
import com.modelforge.api_service.model.repository.ModelRepository;
import com.modelforge.api_service.model.repository.ModelVersionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class InferenceService {

    private final ModelRepository modelRepository;
    private final ModelVersionRepository modelVersionRepository;
    private final InferenceLogRepository inferenceLogRepository;
    private final RestTemplate restTemplate;

    @Value("${modelforge.fastapi-url}")
    private String fastapiUrl;

    public InferResponse infer(String email, UUID modelId, InferRequest request) {
        Model model = modelRepository.findById(modelId)
                .orElseThrow(() -> new RuntimeException("Model not found"));

        ModelVersion latest = modelVersionRepository
                .findByModelIdAndIsLatestTrue(modelId)
                .orElseThrow(() -> new RuntimeException("No version found for model"));

        Map<String, Object> fastapiRequest = new HashMap<>();
        fastapiRequest.put("model_id", latest.getId().toString());
        fastapiRequest.put("inputs", request.getInputs());
        fastapiRequest.put("return_proba", request.isReturnProba());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(fastapiRequest, headers);

        try {
            ResponseEntity<InferResponse> response = restTemplate.exchange(
                    fastapiUrl + "/infer",
                    HttpMethod.POST,
                    entity,
                    InferResponse.class
            );

            InferResponse result = response.getBody();

            // Log async so the user doesn't wait for DB write
            saveLog(model, latest, "SUCCESS", result != null ? result.getLatencyMs() : null, null);

            return result;

        } catch (Exception e) {
            // Log the failure
            saveLog(model, latest, "FAILED", null, e.getMessage());
            throw new RuntimeException("Inference failed: " + e.getMessage());
        }
    }

    @Async
    protected void saveLog(Model model, ModelVersion version,
                           String status, Double latencyMs, String errorMessage) {
        try {
            InferenceLog logEntry = InferenceLog.builder()
                    .model(model)
                    .version(version)
                    .status(status)
                    .latencyMs(latencyMs)
                    .errorMessage(errorMessage)
                    .build();
            inferenceLogRepository.save(logEntry);
        } catch (Exception e) {
            log.error("Failed to save inference log: {}", e.getMessage());
        }
    }
}