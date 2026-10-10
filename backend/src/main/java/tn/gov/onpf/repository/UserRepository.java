package tn.gov.onpf.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.gov.onpf.model.User;

import java.util.Optional;
import tn.gov.onpf.model.Role;

/**
 * مستودع المستخدمين
 * User Repository
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    long countByRoleAndIsActiveTrue(Role role);
    Optional<User> findFirstByRoleAndIsActiveTrueOrderByIdAsc(Role role);
    boolean existsByUsername(String username);
}
