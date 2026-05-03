package com.modelforge.api_service.model.service;

import com.modelforge.api_service.auth.entity.User;
import com.modelforge.api_service.auth.repository.UserRepository;
import com.modelforge.api_service.exception.ModelNotFoundException;
import com.modelforge.api_service.model.dto.ModelResponse;
import com.modelforge.api_service.model.dto.ModelUploadRequest;
import com.modelforge.api_service.model.dto.ModelUploadResponse;
import com.modelforge.api_service.model.entity.Model;
import com.modelforge.api_service.model.entity.ModelVersion;
import com.modelforge.api_service.model.repository.ModelRepository;
import com.modelforge.api_service.model.repository.ModelVersionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ModelService {

    private final ModelRepository modelRepository;
    private final ModelVersionRepository modelVersionRepository;
    private final UserRepository userRepository;

    @Value("${modelforge.upload-dir}")
    private String uploadDir;

    @Transactional
    public ModelUploadResponse uploadModel(String email,
                                           ModelUploadRequest request,
                                           MultipartFile file) throws IOException {
        // Validate file
        if (file.isEmpty()) {
            throw new ModelNotFoundException(file.getOriginalFilename());
        }
        String filename = file.getOriginalFilename();
        if (filename == null || !filename.endsWith(".pkl")) {
            throw new RuntimeException("Only .pkl files are supported");
        }

        // Get owner
        User owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Create model record
        Model model = Model.builder()
                .owner(owner)
                .name(request.getName())
                .description(request.getDescription())
                .inputSchema(request.getInputSchema())
                .isPublic(false)
                .build();
        model = modelRepository.save(model);

        // Create version record
        Integer nextVersion = modelVersionRepository.findMaxVersionNumber(model.getId()) + 1;

        // Save file to disk as {versionId}.pkl
        UUID versionId = UUID.randomUUID();
        Path uploadPath = Paths.get(uploadDir);
        Files.createDirectories(uploadPath);
        Path filePath = uploadPath.resolve(versionId + ".pkl");
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Save version
        ModelVersion version = ModelVersion.builder()
                .id(versionId)
                .model(model)
                .versionNumber(nextVersion)
                .filePath(filePath.toString())
                .isLatest(true)
                .build();
        modelVersionRepository.save(version);

        return ModelUploadResponse.builder()
                .modelId(model.getId())
                .versionId(versionId)
                .versionNumber(nextVersion)
                .name(model.getName())
                .inferEndpoint("/api/models/" + model.getId() + "/infer")
                .message("Model uploaded successfully")
                .build();
    }

    public List<ModelResponse> getMyModels(String email) {
        User owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return modelRepository.findByOwnerIdOrderByCreatedAtDesc(owner.getId())
                .stream()
                .map(model -> {
                    ModelVersion latest = modelVersionRepository
                            .findByModelIdAndIsLatestTrue(model.getId())
                            .orElse(null);
                    return ModelResponse.builder()
                            .id(model.getId())
                            .name(model.getName())
                            .description(model.getDescription())
                            .inputSchema(model.getInputSchema())
                            .isPublic(model.isPublic())
                            .createdAt(model.getCreatedAt())
                            .latestVersion(latest != null ? latest.getVersionNumber() : null)
                            .latestVersionId(latest != null ? latest.getId() : null)
                            .inferEndpoint("/api/models/" + model.getId() + "/infer")
                            .build();
                })
                .collect(Collectors.toList());
    }
}