package tn.gov.onpf.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO للمستخدم
 * User Data Transfer Object
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String role;
    private Boolean isActive;
}

/**
 * DTO لطلب تسجيل الدخول
 * Login Request DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
class LoginRequest {
    private String username;
    private String password;
}

/**
 * DTO لاستجابة تسجيل الدخول
 * Login Response DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
class LoginResponse {
    private String token;
    private UserDTO user;
}
