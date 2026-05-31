package org.example.gestionare_bilete_avion.air_company;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="companii_aeriene")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CompanieAeriana {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nume;

    @Column(name = "cod_iata", length = 2, unique = true, nullable = false)
    private String codIata;
}