package org.example.gestionare_bilete_avion.controller;

import org.example.gestionare_bilete_avion.aeroport.Aeroport;
import org.example.gestionare_bilete_avion.aeroport.AirportRepository;
import org.example.gestionare_bilete_avion.algoritm.Dijkstra;
import org.example.gestionare_bilete_avion.algoritm.Haversine;
import org.example.gestionare_bilete_avion.avion.ModelAvion;
import org.example.gestionare_bilete_avion.oras.Oras;
import org.example.gestionare_bilete_avion.season.Sezon;
import org.example.gestionare_bilete_avion.zbor.Zbor;
import org.example.gestionare_bilete_avion.zbor.ZborRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class ZborService {

    @Autowired
    Haversine haversine;
    @Autowired
    AirportRepository AirportRepo;
    @Autowired
    ZborRepository zborRepository;
    @Autowired
    Dijkstra djk;
    protected double getDistanceBetween2Points(String orasPlecare, String orasDestinatie)
    {
        List<Zbor> zboruri = getList( orasPlecare,orasDestinatie);
        double distance = 0;
        for(var zbor: zboruri)
        {
            distance+=haversine.haversine(zbor.getOrasPlecare().getXCoords(), zbor.getOrasPlecare().getYCoords(), zbor.getOrasDestinatie().getXCoords(), zbor.getOrasDestinatie().getYCoords());
        }
        return distance;
    }
    private Aeroport getAeroport(String iata)
    {
        return AirportRepo.findByIata(iata);
    }
    protected List<Zbor> getList(String plecare, String destinatie) {

        List<Aeroport> aeroporturiPlecare = AirportRepo.findByAirportCityName(plecare);
        List<Aeroport> aeroporturiDestinatie = AirportRepo.findByAirportCityName(destinatie);

        if (aeroporturiPlecare.isEmpty() || aeroporturiDestinatie.isEmpty()) {
            System.out.println("Empty airports " + plecare + " sau " + destinatie);
            return new java.util.ArrayList<>();
        }
        Aeroport aeroportPlecare = aeroporturiPlecare.getFirst();
        Aeroport aeroportDestinatie = aeroporturiDestinatie.getFirst();
        return djk.gasesteCeaMaiIeftinaRuta(aeroportPlecare, aeroportDestinatie, zborRepository.findAll());
    }
    boolean isFlightAvailable(Zbor zbor) {
        Sezon sezon = zbor.getSezon();
        if (sezon == null) {
            return true;
        }
        LocalDate azi = LocalDate.now();
        boolean aInceput = !azi.isBefore(sezon.getDataInceput());
        boolean sAIncheiat = azi.isAfter(sezon.getDataSfarsit());
        return aInceput && !sAIncheiat;
    }
    public double calculeazaCostOperareZbor(Zbor zbor) {

        Oras plecare = zbor.getOrasPlecare();
        Oras destinatie = zbor.getOrasDestinatie();
        ModelAvion avion = zbor.getModelAvion();

        double distantaKm =  getDistanceBetween2Points(plecare.getNumeOras(), destinatie.getNumeOras());

        double costPerKm = (avion.getCostOperarePer100Km() / 100.0)*avion.getTotalLocuri();

        return distantaKm * costPerKm;
    }
}
