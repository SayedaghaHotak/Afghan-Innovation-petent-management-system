package innoandpatentms.iapms.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1.0")
public class TestController {
    
    @GetMapping("/test")
    public String test() {
        return "IAPMS Backend is connected and running!";
    }
}