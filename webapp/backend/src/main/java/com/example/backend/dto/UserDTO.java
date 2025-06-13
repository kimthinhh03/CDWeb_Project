package com.example.backend.dto;

import com.example.backend.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Integer id;
    private Role role;
    private String userName;
    private String email;
    private String phone;
    private String surName;
    private String lastName;
    private Integer active;
    private String picture;
    private LocalDateTime createAt;
    private Integer loginTimes;
    private String address;
    private LocalDate dateOfBirth;
    private String gender;


}
