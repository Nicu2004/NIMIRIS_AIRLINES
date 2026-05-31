package org.example.gestionare_bilete_avion.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;

@Component
public interface UserRepository extends JpaRepository<User, Long>{
    User findByEmail(String email);
}
