package com.modelforge.api_service.apikey.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.Getter;

import java.util.List;
import java.util.UUID;

@Data
@Getter
public class GenerateKeyRequest {
    private List<UUID> modelIds; // empty if isGlobal = true

    @JsonProperty("isGlobal")
    private boolean isGlobal;

    private String label;
}