package org.example.gestionare_bilete_avion.aeroport;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Component;



import java.util.List;
@Component
public interface AirportRepository extends JpaRepository<Aeroport, String> {
    Aeroport findByIcao(String zborplecare);

    Aeroport findByIata(String zborplecare);


    @Query("SELECT a FROM Aeroport a WHERE a.oras.numeOras = :numeOras")
    List<Aeroport> findByAirportCityName(@Param("numeOras") String numeOras);
}
