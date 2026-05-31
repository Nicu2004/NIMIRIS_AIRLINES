package org.example.gestionare_bilete_avion.zbor;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
public class DisponibilitateZbor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "zbor_id", nullable = false)
    @JsonIgnore
    private Zbor zbor;
    private int locuriLibereEconomy;
    private int locuriLibereBusiness;
    private int locuriLibereFirstClass;
}