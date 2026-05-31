package org.example.gestionare_bilete_avion.zbor;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.gestionare_bilete_avion.air_company.CompanieAeriana;
import org.example.gestionare_bilete_avion.avion.ModelAvion;
import org.example.gestionare_bilete_avion.oras.Oras;
import org.example.gestionare_bilete_avion.rezervare.Rezervare;
import org.example.gestionare_bilete_avion.season.Sezon;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name="zbor")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Zbor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String codCursa;
    @ManyToOne
    @JoinColumn(name = "model_avion_id")
    private ModelAvion modelAvion;
    @JsonProperty("pret_economy")
    private float pret_economy;
    @JsonProperty("pret_first_class")
    private float pret_first_class;
    @JsonProperty("pret_business")
    private float pret_business;
    @OneToOne(mappedBy = "zbor", cascade = CascadeType.ALL)
    private DisponibilitateZbor disponibilitate;
    @Enumerated(EnumType.STRING)
    @Column(name = "tip_zbor")
    private TipZbor tipZbor;
    @ManyToOne
    @JoinColumn(name = "sezon_id")
    private Sezon sezon;
    @ElementCollection(targetClass = DayOfWeek.class, fetch = FetchType.EAGER)
    @CollectionTable(name = "zbor_zile_operare", joinColumns = @JoinColumn(name = "zbor_id"))
    @Enumerated(EnumType.STRING)//saves as strings
    @Column(name = "ziua_saptamanii")
    private List<DayOfWeek> zileleSaptamanii;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm:ss")
    private LocalTime oraZborului;
    @ManyToOne
    @JoinColumn(name = "companie_aeriana_id")
    private CompanieAeriana companieAeriana;
    @ManyToOne
    @JoinColumn(name = "oras_plecare_id")
    private Oras orasPlecare;
    @ManyToOne
    @JoinColumn(name = "oras_destinatie_id")
    private Oras orasDestinatie;
    @OneToMany(mappedBy = "zbor", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Rezervare> rezervari;
}
