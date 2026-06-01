package org.example.gestionare_bilete_avion.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    UserRepository userRepository;
    public User inregistrare(User user) {
        if (userRepository.findByEmail(user.getEmail()) != null) {
            throw new RuntimeException("Email deja utilizat!");
        }
        return userRepository.save(user);
    }
    public User login(String email, String parola) {
        User user = userRepository.findByEmail(email);
        if (user != null && user.getParola().equals(parola)) {
            return user;
        }
        return null;
    }
}
