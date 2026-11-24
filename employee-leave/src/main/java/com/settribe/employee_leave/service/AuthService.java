
package com.settribe.employee_leave.service;

import com.settribe.employee_leave.dto.RegisterRequest;
import com.settribe.employee_leave.entity.User;
import com.settribe.employee_leave.entity.Role;
import com.settribe.employee_leave.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.settribe.employee_leave.dto.LoginRequest;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public String register(RegisterRequest request) {

        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(email);

        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        user.setRole(Role.EMPLOYEE);

        userRepository.save(user);

        return "Registration successful";
    }

    @Autowired
    private JwtService jwtService;

    public Map<String, Object> login(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtService.generateToken(user.getEmail());

        return Map.of(
                "token", token,
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail(),
                "role", user.getRole().name()
        );
    }


    public void createAdmin() {

        if (userRepository.existsByEmail("admin@gmail.com")) {
            return;
        }

        User admin = new User();

        admin.setName("Admin");
        admin.setEmail("admin@gmail.com");

        admin.setPassword(
                passwordEncoder.encode("Admin@123")
        );

        admin.setRole(Role.ADMIN);

        userRepository.save(admin);
    }
}
