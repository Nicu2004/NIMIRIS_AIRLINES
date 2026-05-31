package org.example.gestionare_bilete_avion.rezervare;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.example.gestionare_bilete_avion.user.User;
import org.example.gestionare_bilete_avion.zbor.Zbor;

@Entity
@Getter @Setter
public class Rezervare {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    private Zbor zbor;
    @ManyToOne
    private User utilizator;
    private String clasa;
    private int numarPasageri;
    private String numePasager;
    private String telefon;
    private int adulti;
    private int copii;
    private int seniori;
    private boolean areMasa;
    private boolean areBagaj;
    private String metodaPlata;
    private double pretFinal;
    private boolean isPlatit;
}