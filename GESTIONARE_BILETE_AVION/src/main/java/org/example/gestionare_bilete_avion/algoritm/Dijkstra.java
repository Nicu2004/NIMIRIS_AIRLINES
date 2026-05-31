package org.example.gestionare_bilete_avion.algoritm;

import org.example.gestionare_bilete_avion.aeroport.Aeroport;
import org.example.gestionare_bilete_avion.zbor.Zbor;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class Dijkstra {


    private static class NodOras {
        Long idOras;
        double costTotal;

        NodOras(Long idOras, double costTotal) {
            this.idOras = idOras;
            this.costTotal = costTotal;
        }
    }

    /**
     * @param destinatie Aeroportul unde vrem să ajungem
     * @param toateZborurile Lista completă a zborurilor din baza de date
     * @return O listă ordonată de zboruri care formează ruta optimă, sau o listă goală dacă nu există rută.
     */
    public List<Zbor> gasesteCeaMaiIeftinaRuta(Aeroport plecare, Aeroport destinatie, List<Zbor> toateZborurile) {

        Long idStart = plecare.getOras().getId();
        Long idDestinatie = destinatie.getOras().getId();

        Map<Long, List<Zbor>> graf = new HashMap<>();
        for (Zbor zbor : toateZborurile) {
            graf.computeIfAbsent(zbor.getOrasPlecare().getId(), k -> new ArrayList<>()).add(zbor);
        }

        PriorityQueue<NodOras> queue = new PriorityQueue<>(Comparator.comparingDouble(n -> n.costTotal));
        Map<Long, Double> costuriMinime = new HashMap<>();
        Map<Long, Zbor> zborAnterior = new HashMap<>();

        queue.add(new NodOras(idStart, 0.0));
        costuriMinime.put(idStart, 0.0);

        while (!queue.isEmpty()) {
            NodOras curent = queue.poll();

            if (curent.idOras.equals(idDestinatie)) {
                break;
            }

            if (curent.costTotal > costuriMinime.getOrDefault(curent.idOras, Double.MAX_VALUE)) {
                continue;
            }

            List<Zbor> zboruriDisponibile = graf.getOrDefault(curent.idOras, new ArrayList<>());
            for (Zbor zbor : zboruriDisponibile) {
                Long idUrmator = zbor.getOrasDestinatie().getId();
                double costNou = curent.costTotal + zbor.getPret_economy();

                if (costNou < costuriMinime.getOrDefault(idUrmator, Double.MAX_VALUE)) {
                    costuriMinime.put(idUrmator, costNou);
                    zborAnterior.put(idUrmator, zbor);
                    queue.add(new NodOras(idUrmator, costNou));
                }
            }
        }

        List<Zbor> rutaOptima = new ArrayList<>();
        Long idCurent = idDestinatie;

        while (zborAnterior.containsKey(idCurent)) {
            Zbor zbor = zborAnterior.get(idCurent);
            rutaOptima.add(zbor);
            idCurent = zbor.getOrasPlecare().getId();
        }

        Collections.reverse(rutaOptima);

        return rutaOptima;
    }
}