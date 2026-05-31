package org.example.gestionare_bilete_avion.avion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/avioane")
@CrossOrigin(origins = "http://localhost:5173")
public class ModelAvionController {

    @Autowired
    private AvionRepository avionRepository;

    @GetMapping
    public List<ModelAvion> getToateAvioanele() {
        System.out.println("request avioane accesed");
        return avionRepository.findAll();
    }
}