package org.example.gestionare_bilete_avion.avion;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="modele_avioane")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ModelAvion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String numeModel;

    private int locuriFirstClass;
    private int locuriBusiness;
    private int locuriEconomy;

    @Column(name = "viteza_maxima_kmh")
    private int vitezaMaximaKmH;

    @Column(name = "altitudine_maxima_metri")
    private int altitudineMaximaMetri;

    @Column(name = "cost_operare_per100km")
    private double costOperarePer100Km;

    public int getTotalLocuri() {
        return locuriFirstClass + locuriBusiness + locuriEconomy;
    }
}