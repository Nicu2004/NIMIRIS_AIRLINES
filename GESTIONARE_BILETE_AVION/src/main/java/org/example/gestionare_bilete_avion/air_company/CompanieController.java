package org.example.gestionare_bilete_avion.air_company;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/companii")
@CrossOrigin(origins = "http://localhost:5173")
public class CompanieController {
    @Autowired
    CompanieAerianaRepository companieRepository;

    @GetMapping
    public List<CompanieAeriana> getToateCompaniile() {
        return companieRepository.findAll();
    }
}