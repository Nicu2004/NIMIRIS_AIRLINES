package org.example.gestionare_bilete_avion.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/personal")
@CrossOrigin(origins = "http://localhost:5173")
public class PersonalController {
    private final String COD_SECRET_STAFF = "NIMIRIS2026";
    @PostMapping("/login")
    public ResponseEntity<?> loginPersonal(@RequestBody Map<String, String> request) {
        System.out.println("Request is recieved for personal acces");
        String codIntrodus = request.get("cod");
        if (COD_SECRET_STAFF.equals(codIntrodus)) {
            return ResponseEntity.ok().body(Map.of("mesaj", "Acces autorizat"));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Cod personal invalid.");
        }
    }
}