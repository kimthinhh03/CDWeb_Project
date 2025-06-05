package com.example.backend.controller;

import com.example.backend.dto.*;
import com.example.backend.security.JwtTokenProvider;
import com.example.backend.service.UserService;
import org.springframework.security.core.userdetails.UserDetailsService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserDetailsService userDetailsService;

    @Autowired
    public AuthController(UserService userService,
                         JwtTokenProvider jwtTokenProvider,
                         UserDetailsService userDetailsService) {
        this.userService = userService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userDetailsService = userDetailsService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<?>> register(@Valid @RequestBody UserRegistrationDTO registrationDTO) {
        try {
            return ResponseEntity.ok(ApiResponse.success("User registered successfully", userService.registerUser(registrationDTO)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<?>> login(@Valid @RequestBody LoginRequestDTO loginRequest) {
        try {
            LoginResponseDTO response = userService.login(loginRequest);
            return ResponseEntity.ok(ApiResponse.success("Login successful", response));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }



    @GetMapping("/verify-token")
    public ResponseEntity<ApiResponse<?>> verifyToken(@RequestParam String token) {
        boolean isValid = userService.verifyPasswordResetToken(token);
        if (isValid) {
            return ResponseEntity.ok(ApiResponse.success("Token is valid"));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Invalid or expired token"));
        }
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<?>> refreshToken(@RequestParam String refreshToken) {
        try {
            // Validate refresh token
            if (!jwtTokenProvider.validateToken(refreshToken)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("Invalid refresh token"));
            }

            String username = jwtTokenProvider.getUsernameFromToken(refreshToken);

            org.springframework.security.core.userdetails.UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            // Generate new access token
            String newAccessToken = jwtTokenProvider.generateTokenFromUsername(
                    userDetails.getUsername(),
                    userDetails.getAuthorities());

            // Return new tokens
            LoginResponseDTO response = LoginResponseDTO.builder()
                    .token(newAccessToken)
                    .refreshToken(refreshToken) // Keep the same refresh token
                    .user(userService.getUserByUsername(username))
                    .build();

            return ResponseEntity.ok(ApiResponse.success("Token refreshed successfully", response));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }


}
