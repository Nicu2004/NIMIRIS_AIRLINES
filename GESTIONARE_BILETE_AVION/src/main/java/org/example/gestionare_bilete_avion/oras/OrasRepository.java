package org.example.gestionare_bilete_avion.oras;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;

@Component
public interface OrasRepository extends JpaRepository<Oras, Integer> {
}
