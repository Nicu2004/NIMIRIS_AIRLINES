package org.example.gestionare_bilete_avion.rezervare;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RezervareRepository extends JpaRepository<Rezervare, Long> {
    List<Rezervare> findByUtilizatorId(Long utilizatorId);
    List<Rezervare>  findAll();
}
