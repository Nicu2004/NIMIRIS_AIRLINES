package org.example.gestionare_bilete_avion.zbor;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ZborRepository extends JpaRepository<Zbor, String> {
    Zbor findByCodCursa(String zborId);
    List<Zbor> findByCompanieAerianaId(Long companieId);
}
