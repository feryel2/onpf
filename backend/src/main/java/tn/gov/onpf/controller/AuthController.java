package tn.gov.onpf.controller;

import org.springframework.http.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import tn.gov.onpf.model.User;
import tn.gov.onpf.repository.UserRepository;
import tn.gov.onpf.security.JwtTokenProvider;
import java.util.*;

@RestController @RequestMapping("/auth") @CrossOrigin(origins="http://localhost:4200")
public class AuthController {
    private final AuthenticationManager auth; private final UserRepository users; private final JwtTokenProvider tokens; private final PasswordEncoder passwordEncoder;
    public AuthController(AuthenticationManager auth, UserRepository users, JwtTokenProvider tokens, PasswordEncoder passwordEncoder){this.auth=auth;this.users=users;this.tokens=tokens;this.passwordEncoder=passwordEncoder;}
    @PostMapping("/change-password") public Map<String,String> changePassword(@RequestBody Map<String,String> body, Authentication authentication){
        String current=body.get("currentPassword"), next=body.get("newPassword");
        if(current==null || next==null || next.length()<8) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"كلمة المرور الجديدة يجب ألا تقل عن 8 أحرف.");
        User user=users.findByUsername(authentication.getName()).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"المستخدم غير موجود."));
        if(!passwordEncoder.matches(current,user.getPassword())) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"كلمة المرور الحالية غير صحيحة.");
        user.setPassword(passwordEncoder.encode(next)); users.save(user);
        return Collections.singletonMap("message","تم تغيير كلمة المرور بنجاح.");
    }
    @PostMapping("/login") public Map<String,Object> login(@RequestBody Map<String,String> body){
        String username=body.get("username"), password=body.get("password"); if(username==null||password==null)throw new IllegalArgumentException("اسم المستخدم وكلمة المرور إجباريان");
        auth.authenticate(new UsernamePasswordAuthenticationToken(username,password)); User user=users.findByUsername(username).orElseThrow(()->new BadCredentialsException("بيانات الدخول غير صحيحة"));
        Map<String,Object> result=new LinkedHashMap<>(), profile=new LinkedHashMap<>(); profile.put("id",user.getId());profile.put("username",user.getUsername());profile.put("email",user.getEmail());profile.put("fullName",user.getFullName());profile.put("role",user.getRole().name());result.put("token",tokens.generateToken(user.getUsername(),user.getRole().name()));result.put("user",profile);return result;
    }
}
