package org.example.gestionare_bilete_avion.controller;
import org.example.gestionare_bilete_avion.air_company.CompanieAeriana;
import org.example.gestionare_bilete_avion.air_company.CompanieAerianaRepository;
import org.example.gestionare_bilete_avion.avion.AvionRepository;
import org.example.gestionare_bilete_avion.avion.ModelAvion;
import org.example.gestionare_bilete_avion.oras.Oras;
import org.example.gestionare_bilete_avion.oras.OrasRepository;
import org.example.gestionare_bilete_avion.zbor.DisponibilitateZbor;
import org.example.gestionare_bilete_avion.zbor.Zbor;
import org.example.gestionare_bilete_avion.zbor.ZborRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/zboruri")
@CrossOrigin(origins = "http://localhost:5173")
public class ZborController {

    @Autowired
    CompanieAerianaRepository companieRepository;
    @Autowired
    ZborService zborService;
    @Autowired
    ZborRepository zborRepository;
    @Autowired
    OrasRepository orasRepository;
    @Autowired
    AvionRepository avionRepository;
    @GetMapping("/")
    String helloWrold()
    {
        return new String("Hello, and welcome");
    }
    @GetMapping("/{zborId}")
    Zbor returZbor(@PathVariable String zborId)
    {
        return zborRepository.findByCodCursa(zborId);
    }
    @GetMapping("/cauta")
    public List<Zbor> cautaZboruri(
            @RequestParam(name = "plecare", required = false) String plecare,
            @RequestParam(name = "destinatie", required = false) String destinatie
    ) {
        System.out.println("Backend called, find route PLecare =" + plecare + ", Destinatie=" + destinatie);
        return zborService.getList(plecare, destinatie);
    }
    @GetMapping("/ruta/distance/{zborplecare}/{zborDestinatie}")
    double getDistanceBetweenPoints(@PathVariable String zborplecare, @PathVariable String zborDestinatie)
    {
        return zborService.getDistanceBetween2Points(zborplecare, zborDestinatie);
    }
    @GetMapping("/companie/{companieId}")
    public List<Zbor> preiaZboruriCompanie(@PathVariable Long companieId) {
        System.out.println("loading flights for company " + companieId);
        return zborRepository.findByCompanieAerianaId(companieId);
    }

    @PostMapping("/admin/adauga")
    public ResponseEntity<?> adaugaZbor(@RequestBody Zbor zborNou) {
        System.out.println("adauga zbor is called!");
        try {
            if (zborNou.getModelAvion() != null && zborNou.getModelAvion().getId() != null) {
                ModelAvion avionComplet = avionRepository.findById(String.valueOf(zborNou.getModelAvion().getId()))
                        .orElseThrow(() -> new RuntimeException("Avionul nu a fost găsit în baza de date!"));
                zborNou.setModelAvion(avionComplet);
                DisponibilitateZbor disp = new DisponibilitateZbor();
                disp.setZbor(zborNou);
                disp.setLocuriLibereEconomy(avionComplet.getLocuriEconomy());
                disp.setLocuriLibereBusiness(avionComplet.getLocuriBusiness());
                disp.setLocuriLibereFirstClass(avionComplet.getLocuriFirstClass());
                zborNou.setDisponibilitate(disp);
            }

            if (zborNou.getCompanieAeriana() != null && zborNou.getCompanieAeriana().getId() != null) {
                CompanieAeriana companieComplet = companieRepository.findById(Math.toIntExact(zborNou.getCompanieAeriana().getId()))
                        .orElseThrow(() -> new RuntimeException("comany not found"));
                zborNou.setCompanieAeriana(companieComplet);

                if (zborNou.getCodCursa() == null || zborNou.getCodCursa().isEmpty()) {
                    String prefixIata = companieComplet.getCodIata() != null ? companieComplet.getCodIata() : "NIM";
                    zborNou.setCodCursa(prefixIata + (int)(Math.random() * 9000 + 1000));
                }
            } else {
                if (zborNou.getCodCursa() == null || zborNou.getCodCursa().isEmpty()) {
                    zborNou.setCodCursa("NIM" + (int)(Math.random() * 9000 + 1000));
                }
            }

            zborRepository.save(zborNou);
            System.out.println("Saved " + zborNou.getCodCursa());
            return ResponseEntity.ok("Flight Saved with success");

        } catch (Exception e) {
            System.err.println("Error saving" + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("error adding" + e.getMessage());
        }
    }
    @PutMapping("/admin/{id}/modifica-ora")
    public ResponseEntity<?> modificaOraZbor(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        try {
            Zbor zbor = zborRepository.findById(String.valueOf(id))
                    .orElseThrow(() -> new RuntimeException("Zbor not found"));

            String oraNoua = payload.get("oraZborului");
            zbor.setOraZborului(LocalTime.parse(oraNoua));

            zborRepository.save(zbor);
            return ResponseEntity.ok("Hour updated");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("error " + e.getMessage());
        }
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<?> stergeZbor(@PathVariable Long id) {
        try {
            zborRepository.deleteById(String.valueOf(id));
            return ResponseEntity.ok("zbor and res have been deleted");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("error deleting" + e.getMessage());
        }
    }

    @PostMapping("/admin/sugestie-pret")
    public ResponseEntity<?> getSugestiePret(@RequestBody SugestiePretRequest request) {
        try {
            Oras plecare = orasRepository.findById(Math.toIntExact(request.orasPlecareId))
                    .orElseThrow(() -> new RuntimeException("orras plecare not found"));
            Oras destinatie = orasRepository.findById(Integer.valueOf(String.valueOf(request.orasDestinatieId)))
                    .orElseThrow(() -> new RuntimeException("oras destination not found"));
            ModelAvion avion = avionRepository.findById(String.valueOf(request.modelAvionId))
                    .orElseThrow(() -> new RuntimeException("plane not found"));
            Zbor zborTemp = new Zbor();
            zborTemp.setOrasPlecare(plecare);
            zborTemp.setOrasDestinatie(destinatie);
            zborTemp.setModelAvion(avion);

            double costTotalOperare = zborService.calculeazaCostOperareZbor(zborTemp);
            double pretSugeratoPerBilet = (costTotalOperare / avion.getTotalLocuri()) * 1.20;
            return ResponseEntity.ok(Math.round(pretSugeratoPerBilet * 100.0) / 100.0);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("error  " + e.getMessage());
        }
    }
    @PostMapping("/aplica-promo")
    public ResponseEntity<?> aplicaCodPromo(@RequestBody Map<String, String> request) {
        String cod = request.get("cod");
        if ("NIMIRIS20".equalsIgnoreCase(cod)) {
            return ResponseEntity.ok(0.20);
        } else {
            return ResponseEntity.badRequest().body("Cod invalid");
        }
    }
}
class SugestiePretRequest { public Long orasPlecareId; public Long orasDestinatieId; public Long modelAvionId; }
