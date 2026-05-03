package innoandpatentms.iapms.controller;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import innoandpatentms.iapms.entity.Committee;
import innoandpatentms.iapms.repository.CommitteeRepository;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1.0/committees")
@RequiredArgsConstructor
public class CommitteeController {

    private final CommitteeRepository committeeRepository;

    /**
     * Creates a new committee with a semantic check to prevent 
     * duplicates like "Science Dept" and "Dept of Science".
     */
    @PostMapping("/create")
    public ResponseEntity<?> createCommittee(@RequestBody Committee committee) {
        if (committee.getName() == null || committee.getName().isBlank()) {
            return ResponseEntity.badRequest().body("Committee name is required.");
        }

        String inputName = committee.getName().trim();
        String inputFingerprint = generateFingerprint(inputName);

        // Check database for semantic duplicates
        boolean exists = committeeRepository.findAll().stream()
                .anyMatch(c -> generateFingerprint(c.getName()).equals(inputFingerprint));

        if (exists) {
            return ResponseEntity.badRequest()
                    .body("Error: A committee with a similar meaning already exists.");
        }

        committee.setName(inputName);
        Committee saved = committeeRepository.save(committee);
        return ResponseEntity.ok(saved);
    }

    /**
     * Normalizes names for semantic comparison.
     */
    private String generateFingerprint(String name) {
        if (name == null) return "";
        
        // 1. Lowercase and remove non-alphanumeric
        String clean = name.toLowerCase().replaceAll("[^a-z0-9\\s]", "");
        
        // 2. Filter out "noise" words
        List<String> stopWords = Arrays.asList("of", "the", "and", "for", "with", "in", "at");
        
        // 3. Sort words so order doesn't matter
        return Arrays.stream(clean.split("\\s+"))
                .filter(word -> !stopWords.contains(word))
                .sorted()
                .collect(Collectors.joining(" "));
    }
}