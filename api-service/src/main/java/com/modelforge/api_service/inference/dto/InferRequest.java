package com.modelforge.api_service.inference.dto;

import lombok.Data;
import java.util.List;

@Data
public class InferRequest {
    private List<Double> inputs;
    private boolean returnProba = false;
}
