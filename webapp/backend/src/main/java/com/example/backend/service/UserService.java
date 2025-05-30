package com.example.backend.service;


import com.example.backend.dto.LoginRequestDTO;
import com.example.backend.dto.LoginResponseDTO;
import com.example.backend.dto.UserDTO;
import com.example.backend.dto.UserRegistrationDTO;


public interface UserService {
    UserDTO registerUser(UserRegistrationDTO registrationDTO);
    LoginResponseDTO login(LoginRequestDTO loginRequest);
    UserDTO getUserByUsername(String username);
    boolean verifyPasswordResetToken(String token);


}
