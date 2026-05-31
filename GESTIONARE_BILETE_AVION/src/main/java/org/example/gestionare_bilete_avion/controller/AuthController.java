package org.example.gestionare_bilete_avion.controller;

import org.example.gestionare_bilete_avion.user.User;
import org.example.gestionare_bilete_avion.user.UserRepository;
import org.example.gestionare_bilete_avion.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    UserService userService;
    @Autowired
    UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            System.out.println("register user called");
            return ResponseEntity.ok(userService.inregistrare(user));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PostMapping("/aeroport/login")
    public ResponseEntity<?> loginAeroportStaff(@RequestBody Map<String, String> request) {
        System.out.println("airport login requested");
        String codIntrodus = request.get("cod");
        if ("PORTA2026".equals(codIntrodus)) {
            return ResponseEntity.ok().body(Map.of("mesaj", "Acces autorizat la ghișeu"));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Cod de ghișeu invalid.");
        }
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        
        User user = userRepository.findByEmail(request.email);

        if (user.getParola().equals(request.parola)) {

            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("rol", user.getRol());
            response.put("mesaj", "Login cu succes");

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body("Password incorrect");
        }
    }
}
class LoginRequest{
    public String email;
    public String parola;
}