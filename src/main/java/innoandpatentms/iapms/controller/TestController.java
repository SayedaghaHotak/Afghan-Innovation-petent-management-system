package innoandpatentms.iapms.controller;

import org.springframework.web.bind.annotation.GetMapping;
<<<<<<< HEAD
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1.0")
public class TestController {
    
    @GetMapping("/test")
    public String test() {
        return "IAPMS Backend is connected and running!";
=======
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {
    @GetMapping("/test")
    public String test() {
        return "Backend is connected and running!";
>>>>>>> 293d29251395257b79b7bd5c8424ecdc5e43622b
    }
}