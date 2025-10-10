package com.wecp.healthcare_appointment_management_system.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/news")
@CrossOrigin(origins = "*") // or specify your frontend URL
public class NewsController {

    private final String API_URL = "https://gnews.io/api/v4/top-headlines?category=health&lang=en&apikey=7d0e3f203ae7967c37acea40374ac006";

    @GetMapping
    public ResponseEntity<String> getHealthNews() {
        try {
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.getForEntity(API_URL, String.class);
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\":\"Unable to fetch news\"}");
        }
    }
}
