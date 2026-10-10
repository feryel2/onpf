package tn.gov.onpf.controller;

import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import tn.gov.onpf.model.Role;
import tn.gov.onpf.model.User;
import tn.gov.onpf.repository.UserRepository;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:4200")
@PreAuthorize("hasRole('SENIOR_VERIFIER')")
public class UserController {
    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository users, PasswordEncoder passwordEncoder) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public List<Map<String, Object>> list() {
        return users.findAll(Sort.by("id").ascending()).stream().map(this::userMap).collect(Collectors.toList());
    }

    @PostMapping
    public Map<String, Object> create(@RequestBody Map<String, Object> data) {
        String username = required(data, "username");
        String email = required(data, "email");
        String fullName = required(data, "fullName");
        String password = required(data, "password");
        Role role = parseRole(required(data, "role"));
        if (password.length() < 8) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "كلمة المرور يجب ألا تقل عن 8 أحرف.");
        if (users.findByUsername(username).isPresent()) throw new ResponseStatusException(HttpStatus.CONFLICT, "اسم المستخدم مستخدم مسبقاً.");
        if (users.findByEmail(email).isPresent()) throw new ResponseStatusException(HttpStatus.CONFLICT, "البريد الإلكتروني مستخدم مسبقاً.");

        User user = User.builder()
                .username(username)
                .email(email)
                .fullName(fullName)
                .password(passwordEncoder.encode(password))
                .role(role)
                .isActive(true)
                .build();
        return userMap(users.save(user));
    }

    @PutMapping("/{id}")
    public Map<String, Object> update(@PathVariable Long id, @RequestBody Map<String, Object> data, Authentication actor) {
        User user = users.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "المستخدم غير موجود."));
        String email = data.containsKey("email") ? required(data, "email") : user.getEmail();
        users.findByEmail(email).filter(existing -> !existing.getId().equals(id))
                .ifPresent(existing -> { throw new ResponseStatusException(HttpStatus.CONFLICT, "البريد الإلكتروني مستخدم مسبقاً."); });
        if (data.containsKey("fullName")) user.setFullName(required(data, "fullName"));
        user.setEmail(email);

        Role nextRole = data.containsKey("role") ? parseRole(required(data, "role")) : user.getRole();
        boolean nextActive = data.containsKey("isActive") ? Boolean.parseBoolean(String.valueOf(data.get("isActive"))) : Boolean.TRUE.equals(user.getIsActive());
        if (user.getUsername().equals(actor.getName()) && (!nextActive || nextRole != Role.SENIOR_VERIFIER)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "لا يمكن تعطيل حسابك أو تغيير دورك الحالي.");
        }
        if (user.getRole() == Role.SENIOR_VERIFIER && Boolean.TRUE.equals(user.getIsActive()) && (!nextActive || nextRole != Role.SENIOR_VERIFIER)
                && users.countByRoleAndIsActiveTrue(Role.SENIOR_VERIFIER) <= 1) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "يجب الإبقاء على مستخدم نشط واحد على الأقل بدور المتثبت الأعلى.");
        }

        user.setRole(nextRole);
        user.setIsActive(nextActive);
        return userMap(users.save(user));
    }

    private Role parseRole(String value) {
        try {
            return Role.valueOf(value);
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "الدور المحدد غير صالح.");
        }
    }

    private String required(Map<String, Object> data, String key) {
        Object value = data.get(key);
        if (value == null || String.valueOf(value).trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "الحقل " + key + " إجباري.");
        }
        return String.valueOf(value).trim();
    }

    private Map<String, Object> userMap(User user) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", user.getId());
        result.put("username", user.getUsername());
        result.put("email", user.getEmail());
        result.put("fullName", user.getFullName());
        result.put("role", user.getRole().name());
        result.put("isActive", Boolean.TRUE.equals(user.getIsActive()));
        result.put("createdAt", user.getCreatedAt());
        return result;
    }
}
