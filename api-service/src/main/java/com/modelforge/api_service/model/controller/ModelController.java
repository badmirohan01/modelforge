package com.modelforge.api_service.model.controller;

import com.modelforge.api_service.model.dto.ModelResponse;
import com.modelforge.api_service.model.dto.ModelUploadRequest;
import com.modelforge.api_service.model.dto.ModelUploadResponse;
import com.modelforge.api_service.model.service.ModelService;
import jakarta.validation.Valid;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/models")
@RequiredArgsConstructor
public class ModelController {

    private final ModelService modelService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ModelUploadResponse> upload(
            @RequestPart("file") MultipartFile file,
            @RequestPart("name") String name,
            @RequestPart(value = "description", required = false) String description,
            @RequestPart(value = "inputSchema", required = false) String inputSchema,
            Authentication authentication) throws IOException {

        ModelUploadRequest request = new ModelUploadRequest();
        request.setName(name);
        request.setDescription(description);
        request.setInputSchema(inputSchema);

        ModelUploadResponse response = modelService.uploadModel(
                authentication.getName(), request, file);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ModelResponse>> getMyModels(Authentication authentication) {
        return ResponseEntity.ok(modelService.getMyModels(authentication.getName()));
    }

    @GetMapping("/{modelId}")
    public ResponseEntity<ModelResponse> getModel(
            @PathVariable UUID modelId,
            Authentication authentication) {
        return ResponseEntity.ok(modelService.getModel(modelId, authentication.getName()));
    }
}