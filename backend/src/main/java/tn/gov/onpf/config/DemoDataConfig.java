package tn.gov.onpf.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import tn.gov.onpf.model.*;
import tn.gov.onpf.repository.UserRepository;

@Configuration
public class DemoDataConfig {
        private static final String SQL_PLACEHOLDER_PASSWORD = "$2a$10$slYQmyNdGzDKJSDL1d6i5uj.7wV1f1Z1KKK1KKK1KKK1KKK1KKK1K";

    @Bean CommandLineRunner demoUsers(UserRepository users, PasswordEncoder encoder) {
        return args -> { create(users,encoder,"editor_user","editor@onpf.tn","المحرر",Role.EDITOR); create(users,encoder,"verifier_user","verifier@onpf.tn","المتثبت",Role.VERIFIER); create(users,encoder,"senior_verifier","senior@onpf.tn","المتثبت الأعلى",Role.SENIOR_VERIFIER); };
    }
    private void create(UserRepository users, PasswordEncoder encoder, String username, String email, String name, Role role) {
        User user = users.findByUsername(username).orElse(null);
        if (user == null) {
            user = User.builder().username(username).email(email).fullName(name).role(role).isActive(true).password(encoder.encode("password")).build();
        } else if (user.getPassword() == null || SQL_PLACEHOLDER_PASSWORD.equals(user.getPassword())) {
            user.setPassword(encoder.encode("password"));
        }
        if (user.getIsActive() == null) user.setIsActive(true);
        users.save(user);
    }
}
