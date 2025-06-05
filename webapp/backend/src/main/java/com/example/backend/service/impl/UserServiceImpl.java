package com.example.backend.service.impl;

import com.example.backend.dto.LoginRequestDTO;
import com.example.backend.dto.LoginResponseDTO;
import com.example.backend.dto.UserDTO;
import com.example.backend.dto.UserRegistrationDTO;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.JwtTokenProvider;
import com.example.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Override
    @Transactional
    public UserDTO registerUser(UserRegistrationDTO registrationDTO) {
        // Kiểm tra username đã tồn tại
        if (userRepository.existsByUserName(registrationDTO.getUserName())) {
            throw new IllegalArgumentException("Username already exists");
        }

        // Kiểm tra email đã tồn tại
        if (userRepository.existsByEmail(registrationDTO.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        // Kiểm tra phone đã tồn tại
        if (userRepository.existsByPhone(registrationDTO.getPhone())) {
            throw new IllegalArgumentException("Phone number already exists");
        }

        // Tạo user mới
        User user = new User();
        user.setUserName(registrationDTO.getUserName());
        user.setPassword(passwordEncoder.encode(registrationDTO.getPassword()));
        user.setEmail(registrationDTO.getEmail());
        user.setPhone(registrationDTO.getPhone());
        user.setSurName(registrationDTO.getSurName());
        user.setLastName(registrationDTO.getLastName());
        user.setAddress(registrationDTO.getAddress());
        user.setDateOfBirth(registrationDTO.getDateOfBirth());
        user.setGender(registrationDTO.getGender());

        user.setRole(false); // mặc định là user
        user.setActive(1); //kích hoạt ngay
        user.setLoginTimes(0);
        user.setLockFail(0);
        user.setCreateAt(LocalDateTime.now());
        user.setUpdateAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);
        return convertToDTO(savedUser);
    }

    @Override
    public LoginResponseDTO login(LoginRequestDTO loginRequest) {
        // Tìm user theo username
        User user = userRepository.findByUserName(loginRequest.getUserName())
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

        // Kiểm tra password
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        // Kiểm tra account có active không
        if (user.getActive() == 0) {
            throw new IllegalArgumentException("Account is not activated");
        }

        // Cập nhật login times
        user.setLoginTimes(user.getLoginTimes() + 1);
        user.setUpdateAt(LocalDateTime.now());
        userRepository.save(user);

        // Tạo authorities
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(user.getRole() ? "ROLE_ADMIN" : "ROLE_USER"));

        // Tạo JWT tokens
        String accessToken = jwtTokenProvider.generateTokenFromUsername(user.getUserName(), authorities);
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getUserName());

        return LoginResponseDTO.builder()
                .token(accessToken)
                .refreshToken(refreshToken)
                .user(convertToDTO(user))
                .build();
    }



    @Override
    public UserDTO getUserByUsername(String username) {
        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found with username: " + username));
        return convertToDTO(user);
    }



    @Override
    public boolean verifyPasswordResetToken(String token) {
        return userRepository.findByPasswordResetToken(token).isPresent();
    }



    private UserDTO convertToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .role(user.getRole())
                .userName(user.getUserName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .surName(user.getSurName())
                .lastName(user.getLastName())
                .active(user.getActive())
                .picture(user.getPicture())
                .createAt(user.getCreateAt())
                .loginTimes(user.getLoginTimes())
                .address(user.getAddress())
                .dateOfBirth(user.getDateOfBirth())
                .gender(user.getGender())
                .build();
    }
}
