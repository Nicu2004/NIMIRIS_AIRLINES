package org.example.gestionare_bilete_avion.rezervare;

import org.example.gestionare_bilete_avion.user.UserRepository;
import org.example.gestionare_bilete_avion.zbor.DisponibilitateZbor;
import org.example.gestionare_bilete_avion.zbor.Zbor;
import org.example.gestionare_bilete_avion.zbor.ZborRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rezervari")
@CrossOrigin(origins = "http://localhost:5173")
public class RezervareController {

    @Autowired
    RezervareRepository rezervareRepository;
    @Autowired
    ZborRepository zborRepository;
    @Autowired
    UserRepository userRepository;
    private void scadeLocuri(Zbor zbor, String clasa, int numarPasageri) {
        DisponibilitateZbor disp = zbor.getDisponibilitate();
        if (disp == null) {
            throw new RuntimeException("no data to show");
        }

        if (clasa == null) {
            throw new RuntimeException("Class for flight is not specified");
        }

        switch (clasa.toUpperCase()) {
            case "ECONOMY":
                if (disp.getLocuriLibereEconomy() < numarPasageri)
                    throw new RuntimeException("Not enough seats for econmy");
                disp.setLocuriLibereEconomy(disp.getLocuriLibereEconomy() - numarPasageri);
                break;
            case "BUSINESS":
                if (disp.getLocuriLibereBusiness() < numarPasageri)
                    throw new RuntimeException("Not enough seats for Business!");
                disp.setLocuriLibereBusiness(disp.getLocuriLibereBusiness() - numarPasageri);
                break;
            case "FIRST":
                if (disp.getLocuriLibereFirstClass() < numarPasageri)
                    throw new RuntimeException("Not enough seats for First Class!");
                disp.setLocuriLibereFirstClass(disp.getLocuriLibereFirstClass() - numarPasageri);
                break;
            default:
                throw new RuntimeException("invalid param");
        }
    }
    @PutMapping("/admin/valideaza-plata/{id}")
    public ResponseEntity<?> valideazaPlataCash(@PathVariable Long id) {
        try {
            Rezervare rezervare = rezervareRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("rezervation not found"));
            rezervare.setPlatit(true);
            rezervareRepository.save(rezervare);

            System.out.println("Paymeant is accepted" + id);
            return ResponseEntity.ok("payed with success");

        } catch (Exception e) {
            System.err.println("error validaing payjmanet " + e.getMessage());
            return ResponseEntity.badRequest().body("error" + e.getMessage());
        }
    }
    @PostMapping("/creaza-fara-cont")
    public ResponseEntity<?> creazaRezervareFaraCont(@RequestBody RezervareGuestRequest request) {
        try {
            Zbor zbor = zborRepository.findById(String.valueOf(request.zborId))
                    .orElseThrow(() -> new RuntimeException("selected flight not available"));
            int totalPasageri = request.adulti + request.copii + request.seniori;

            scadeLocuri(zbor, request.clasa, totalPasageri);
            Rezervare rezervareNoua = new Rezervare();
            rezervareNoua.setZbor(zbor);
            rezervareNoua.setUtilizator(null);
            rezervareNoua.setClasa(request.clasa);
            rezervareNoua.setNumePasager(request.numePasager);
            rezervareNoua.setTelefon(request.telefon);
            rezervareNoua.setAdulti(request.adulti);
            rezervareNoua.setCopii(request.copii);
            rezervareNoua.setSeniori(request.seniori);

            rezervareNoua.setNumarPasageri(request.adulti + request.copii + request.seniori);

            rezervareNoua.setAreMasa(request.areMasa);
            rezervareNoua.setAreBagaj(request.areBagaj);
            rezervareNoua.setMetodaPlata(request.metodaPlata);
            rezervareNoua.setPretFinal(request.pretFinal);
            rezervareNoua.setPlatit(request.isPlatit);

            zborRepository.save(zbor);
            rezervareRepository.save(rezervareNoua);

            return ResponseEntity.ok("Succes for creating new rezervare!");

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("error to save" + e.getMessage());
        }
    }
    @PostMapping("/creaza")
    public ResponseEntity<?> creazaRezervare(@RequestBody RezervareRequest request) {

        System.out.println("creaza rezervare is called");
        try {
            Long zborIdLong = Long.valueOf(request.zborId);
            Long userIdLong = Long.valueOf(request.userId);

            var zbor = zborRepository.findById(String.valueOf(zborIdLong))
                    .orElseThrow(() -> new RuntimeException("zbor no exists"));

            var utilizator = userRepository.findById(userIdLong)
                    .orElseThrow(() -> new RuntimeException("user not exists"));
            scadeLocuri(zbor, request.clasa, request.numarPasageri);
            Rezervare rezervare = new Rezervare();
            rezervare.setZbor(zbor);
            rezervare.setUtilizator(utilizator);
            rezervare.setClasa(request.clasa);
            rezervare.setNumePasager(request.numePasager);
            rezervare.setTelefon(request.telefon);
            rezervare.setNumarPasageri(request.numarPasageri);
            rezervare.setMetodaPlata(request.metodaPlata);
            rezervare.setPretFinal(request.pretFinal);
            boolean isPlatit = "CARD".equalsIgnoreCase(request.metodaPlata);
            rezervare.setPlatit(isPlatit);
            zborRepository.save(zbor);
            rezervareRepository.save(rezervare);

            return ResponseEntity.ok("reservare saved success!");
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("error " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("error " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getRezervarileMele(@PathVariable Long userId) {
        try {
            List<Rezervare> rezervari = rezervareRepository.findByUtilizatorId(userId);
            return ResponseEntity.ok(rezervari);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("error getting the reservation" + e.getMessage());
        }
    }
}

class RezervareRequest {
    public String zborId;
    public String userId;
    public String clasa;
    public double pretFinal;
    public int numarPasageri;
    public String metodaPlata;
    public String numePasager;
    public String telefon;
}
class RezervareGuestRequest {
    public Long zborId;
    public String numePasager;
    public String clasa;
    public String telefon;
    public int adulti;
    public int copii;
    public int seniori;
    public boolean areMasa;
    public boolean areBagaj;
    public String metodaPlata;
    public double pretFinal;
    public boolean isPlatit;
}