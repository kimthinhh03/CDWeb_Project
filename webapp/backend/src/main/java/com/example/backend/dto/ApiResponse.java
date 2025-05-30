//package com.example.backend.dto;
//
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//public class ApiResponse<T> {
//    private String result;
//    private String message;
//    private T data;
//
//    public static <T> ApiResponse<T> success(String message, T data) {
//        return new ApiResponse<>("SUCCESS", message, data);
//    }
//
//    public static <T> ApiResponse<T> success(String message) {
//        return new ApiResponse<>("SUCCESS", message, null);
//    }
//
//    public static <T> ApiResponse<T> error(String message) {
//        return new ApiResponse<>("ERROR", message, null);
//    }
//
//    public static <T> ApiResponse<T> error(int code, String message) {
//        return new ApiResponse<>("ERROR", message, null);
//    }
//}
