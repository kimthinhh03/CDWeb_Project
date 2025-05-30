package com.example.backend.utils;

import java.text.Normalizer;
import java.util.regex.Pattern;

public class VietnameseUtils {
    public static String removeAccents(String input) {
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        return pattern.matcher(normalized).replaceAll("");
    }

    public static String toUpperNoAccent(String input) {
        return removeAccents(input).toUpperCase();
    }
}
