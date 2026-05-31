package org.example.gestionare_bilete_avion.controller;

import org.example.gestionare_bilete_avion.dto.LoginDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/air-company")
public class AirCompanyController {

    @PostMapping("/login")
    public ResponseEntity<String> loginAirCompany(@RequestBody LoginDto loginData) {

        if ("tarom_admin".equals(loginData.getUsername()) && "parola123".equals(loginData.getPassword())) {

            return ResponseEntity.ok("Autentificare realizată cu succes!");

        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Date de autentificare incorecte.");
        }
    }
}