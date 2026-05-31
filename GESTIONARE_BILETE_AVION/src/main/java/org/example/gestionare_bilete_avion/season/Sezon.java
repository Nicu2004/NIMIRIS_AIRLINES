package org.example.gestionare_bilete_avion.season;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Table(name="sezoane")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Sezon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nume;

    @Column(name = "data_inceput", nullable = false)
    private LocalDate dataInceput;

    @Column(name = "data_sfarsit", nullable = false)
    private LocalDate dataSfarsit;
}