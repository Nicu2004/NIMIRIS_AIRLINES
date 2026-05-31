package org.example.gestionare_bilete_avion.config;

import org.example.gestionare_bilete_avion.zbor.DisponibilitateZbor;
import org.example.gestionare_bilete_avion.zbor.Zbor;
import org.example.gestionare_bilete_avion.zbor.ZborRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initializeazaLocuri(ZborRepository zborRepository) {
        return args -> {
            List<Zbor> toateZborurile = zborRepository.findAll();
            boolean sAuFacutModificari = false;

            for (Zbor zbor : toateZborurile) {
                if (zbor.getDisponibilitate() == null && zbor.getModelAvion() != null) {

                    DisponibilitateZbor disp = new DisponibilitateZbor();
                    disp.setZbor(zbor);

                    disp.setLocuriLibereEconomy(zbor.getModelAvion().getLocuriEconomy());
                    disp.setLocuriLibereBusiness(zbor.getModelAvion().getLocuriBusiness());
                    disp.setLocuriLibereFirstClass(zbor.getModelAvion().getLocuriFirstClass());

                    zbor.setDisponibilitate(disp);

                    zborRepository.save(zbor);

                    sAuFacutModificari = true;
                    System.out.println("generated modificatioins for zbor" + zbor.getCodCursa());
                }
            }
            if (sAuFacutModificari) {
                System.out.println("aboruri actializater");
            }
        };
    }
}