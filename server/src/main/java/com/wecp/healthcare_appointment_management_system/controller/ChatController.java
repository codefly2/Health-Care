package com.wecp.healthcare_appointment_management_system.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Value("${sambanova.api.key}")
    private String sambaApiKey;

    private final String SAMBA_API_URL = "https://api.sambanova.ai/v1/chat/completions";

    @PostMapping
    public ResponseEntity<Map<String, Object>> chatWithAI(@RequestBody Map<String, String> body) {
        String userMessage = body.get("message");

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + sambaApiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> request = new HashMap<>();
        request.put("model", "Meta-Llama-3.1-8B-Instruct"); // free model name on SambaNova
        request.put("messages", Arrays.asList(
                Map.of("role", "system", "content", "You are a helpful health assistant. Provide safe home remedies, causes, and suggest doctor specialities."),
                Map.of("role", "user", "content", userMessage)
        ));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
        ResponseEntity<Map> response = restTemplate.exchange(SAMBA_API_URL, HttpMethod.POST, entity, Map.class);

        // Extract the chatbot reply
        String reply = (String) ((Map) ((List) response.getBody().get("choices")).get(0)).get("message").toString();

        Map<String, Object> result = new HashMap<>();
        result.put("reply", reply);

        return ResponseEntity.ok(result);
    }
}