package com.modelforge.api_service.inference.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;

@Data
public class InferResponse {
    private Object prediction;
    private List<Double> probabilities;

    @JsonProperty("latency_ms")
    private Double latencyMs;

    @JsonProperty("model_id")
    private String modelId;
}