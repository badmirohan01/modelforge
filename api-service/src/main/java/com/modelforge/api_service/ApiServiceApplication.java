package com.modelforge.api_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class ApiServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(ApiServiceApplication.class, args);
	}

}
