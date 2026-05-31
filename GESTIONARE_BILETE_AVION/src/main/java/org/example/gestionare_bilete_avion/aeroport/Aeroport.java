package org.example.gestionare_bilete_avion.aeroport;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.gestionare_bilete_avion.oras.Oras;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name="aeroporturi")
public class Aeroport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idAeroport;
    private String icao;
    private String iata;
    @ManyToOne
    @JoinColumn(name = "oras_id")
    private Oras oras;

}
