package org.example.gestionare_bilete_avion.controller;

import org.example.gestionare_bilete_avion.rezervare.Rezervare;
import org.example.gestionare_bilete_avion.rezervare.RezervareRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/airport-staff")
@CrossOrigin(origins = "http://localhost:5173")
public class AirportStaffController {

    @Autowired
    private RezervareRepository rezervareRepository;

    @GetMapping("/toate-rezervarile")
    public ResponseEntity<List<Rezervare>> getToateRezervarile() {
        System.out.println("getting all the rezervari is called");
        System.out.println(rezervareRepository.findAll());
        return ResponseEntity.ok(rezervareRepository.findAll());
    }

    @PutMapping("/valideaza-plata/{id}")
    public ResponseEntity<?> valideazaPlataCash(@PathVariable Long id) {
        try {
            Rezervare rezervare = rezervareRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Rezervarea nu a fost găsită!"));
            rezervare.setPlatit(true);
            rezervareRepository.save(rezervare);

            return ResponseEntity.ok("Plata a fost încasată cu succes!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Eroare la validare: " + e.getMessage());
        }
    }
}