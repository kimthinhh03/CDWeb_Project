//package com.example.backend.security;
//
//import io.jsonwebtoken.*;
//import io.jsonwebtoken.security.Keys;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.stereotype.Component;
//
//import javax.crypto.SecretKey;
//import java.util.Collection;
//import java.util.Date;
//import java.util.stream.Collectors;
//
//@Component
//public class JwtTokenProvider {
//
//    @Value("${app.jwt.secret:mySecretKey}")
//    private String jwtSecret;
//
//    @Value("${app.jwt.expiration:86400000}") // 24 hours
//    private long jwtExpirationMs;
//
//    @Value("${app.jwt.refresh-expiration:604800000}") // 7 days
//    private long refreshTokenExpirationMs;
//
//    private SecretKey getSigningKey() {
//        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
//    }
//
//    public String generateTokenFromUsername(String username, Collection<? extends GrantedAuthority> authorities) {
//        Date expiryDate = new Date(System.currentTimeMillis() + jwtExpirationMs);
//
//        String roles = authorities.stream()
//                .map(GrantedAuthority::getAuthority)
//                .collect(Collectors.joining(","));
//
//        return Jwts.builder()
//                .setSubject(username)
//                .claim("roles", roles)
//                .setIssuedAt(new Date())
//                .setExpiration(expiryDate)
//                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
//                .compact();
//    }
//
//    public String generateRefreshToken(String username) {
//        Date expiryDate = new Date(System.currentTimeMillis() + refreshTokenExpirationMs);
//
//        return Jwts.builder()
//                .setSubject(username)
//                .setIssuedAt(new Date())
//                .setExpiration(expiryDate)
//                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
//                .compact();
//    }
//
//    public String getUsernameFromToken(String token) {
//        Claims claims = Jwts.parserBuilder()
//                .setSigningKey(getSigningKey())
//                .build()
//                .parseClaimsJws(token)
//                .getBody();
//
//        return claims.getSubject();
//    }
//
//    public boolean validateToken(String token) {
//        try {
//            Jwts.parserBuilder()
//                    .setSigningKey(getSigningKey())
//                    .build()
//                    .parseClaimsJws(token);
//            return true;
//        } catch (JwtException | IllegalArgumentException e) {
//            return false;
//        }
//    }
//
//    public Date getExpirationDateFromToken(String token) {
//        Claims claims = Jwts.parserBuilder()
//                .setSigningKey(getSigningKey())
//                .build()
//                .parseClaimsJws(token)
//                .getBody();
//
//        return claims.getExpiration();
//    }
//
//    public boolean isTokenExpired(String token) {
//        Date expiration = getExpirationDateFromToken(token);
//        return expiration.before(new Date());
//    }
//}
