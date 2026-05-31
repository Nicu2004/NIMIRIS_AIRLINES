package org.example.gestionare_bilete_avion.controller;

import org.example.gestionare_bilete_avion.oras.Oras;
import org.example.gestionare_bilete_avion.oras.OrasRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/orase")
@CrossOrigin(origins = "http://localhost:5173")
public class OrasController {

    @Autowired
    private OrasRepository orasRepository;

    @GetMapping
    public List<Oras> getAllOrase() {
        System.out.println("get all orase called");
        return orasRepository.findAll();
    }
}