package tn.gov.onpf.security;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import tn.gov.onpf.model.User;
import tn.gov.onpf.repository.UserRepository;
import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository users;
    public CustomUserDetailsService(UserRepository users) { this.users = users; }
    @Override public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = users.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("Utilisateur introuvable"));
        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(),
                Boolean.TRUE.equals(user.getIsActive()), true, true, true,
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())));
    }
}
