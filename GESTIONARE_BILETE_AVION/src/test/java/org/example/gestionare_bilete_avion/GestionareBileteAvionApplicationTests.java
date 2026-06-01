package org.example.gestionare_bilete_avion;

import org.example.gestionare_bilete_avion.avion.ModelAvion;
import org.example.gestionare_bilete_avion.oras.Oras;
import org.example.gestionare_bilete_avion.rezervare.Rezervare;
import org.example.gestionare_bilete_avion.zbor.Zbor;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class GestionareBileteAvionApplicationTests {

    @Test
    void testValidarePreturiNegative() {
        Zbor zbor = new Zbor();
        zbor.setPret_economy(-50.0f);
        zbor.setPret_business(-120.0f);
        zbor.setPret_first_class(0.0f);

        assertTrue(zbor.getPret_economy() < 0, "Prețul Economy nu negatiov");
        assertTrue(zbor.getPret_business() < 0, "Prețul Business nu negativ");
        assertEquals(0.0f, zbor.getPret_first_class(), "Prețul First Class poate nu 0 sau negativ");
    }

    @Test
    void testGestionareZileOperareSaptamana() {
        Zbor zbor = new Zbor();
        java.util.List<java.time.DayOfWeek> zile = new java.util.ArrayList<>();
        zile.add(java.time.DayOfWeek.MONDAY);
        zile.add(java.time.DayOfWeek.FRIDAY);

        zbor.setZileleSaptamanii(zile);
        assertNotNull(zbor.getZileleSaptamanii());
        assertEquals(2, zbor.getZileleSaptamanii().size(), "zbor cannot operate in 2 days");
        assertTrue(zbor.getZileleSaptamanii().contains(java.time.DayOfWeek.MONDAY));
        assertFalse(zbor.getZileleSaptamanii().contains(java.time.DayOfWeek.SUNDAY), "nu on days that are not specified");
    }

    @Test
    void testModificareOraZborExistent() {
        Zbor zbor = new Zbor();
        zbor.setOraZborului(java.time.LocalTime.parse("08:00:00"));
        java.time.LocalTime oraNoua = java.time.LocalTime.parse("19:45:00");
        zbor.setOraZborului(oraNoua);
        assertEquals("19:45", zbor.getOraZborului().toString(), "data shoulf be validated");
    }

    @Test
    void testValidareFormatCodCursa() {
        Zbor zbor = new Zbor();
        String prefixCompanie = "W6";
        int numarAleatoriu = 8431;
        zbor.setCodCursa(prefixCompanie + numarAleatoriu);
        assertNotNull(zbor.getCodCursa());
        assertEquals(6, zbor.getCodCursa().length(), "just 6 cghars for curse code");
        assertTrue(zbor.getCodCursa().startsWith("W6"), "cod should stard with company code");
    }
    @Test
    void testConfigurareZborComplet() {
        Oras plecare = new Oras();
        plecare.setNumeOras("București");
        Oras destinatie = new Oras();
        destinatie.setNumeOras("Londra");
        Zbor zbor = new Zbor();
        zbor.setCodCursa("RO1234");
        zbor.setOrasPlecare(plecare);
        zbor.setOrasDestinatie(destinatie);
        zbor.setOraZborului(LocalTime.parse("14:30:00"));
        zbor.setPret_economy(100.0f);
        assertEquals("RO1234", zbor.getCodCursa());
        assertEquals("București", zbor.getOrasPlecare().getNumeOras());
        assertEquals("Londra", zbor.getOrasDestinatie().getNumeOras());
        assertEquals(100.0f, zbor.getPret_economy());
        assertEquals("14:30", zbor.getOraZborului().toString());
    }
    @Test
    void testAsignareAvionSiCapacitate() {
        ModelAvion avion = new ModelAvion();
        avion.setNumeModel("Airbus A320");
        Zbor zbor = new Zbor();
        zbor.setModelAvion(avion);
        assertNotNull(zbor.getModelAvion());
        assertEquals("Airbus A320", zbor.getModelAvion().getNumeModel());
        assertEquals(avion.getTotalLocuri(), zbor.getModelAvion().getTotalLocuri());
    }
}
