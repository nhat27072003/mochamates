package com.mochamates.web.services;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.Date;
import java.util.UUID;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.mochamates.web.entities.RefreshToken;
import com.mochamates.web.repository.RefreshTokenRepository;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import jakarta.transaction.Transactional;

@Component
public class TokenService {
	private SecretKey key;
	private RefreshTokenRepository refreshTokenRepository;

	public TokenService(@Value("${jwt.secret}") String secret, RefreshTokenRepository refreshTokenRepository) {
		if (secret.isEmpty()) {
			throw new IllegalStateException("JWT Secret key is missing in application.properties");
		}
		if (secret == null || secret.length() < 32) {
			throw new IllegalArgumentException("JWT Secret key must be at least 32 characters long!");
		}
		byte[] decodedKey = Base64.getDecoder().decode(secret);
		this.key = Keys.hmacShaKeyFor(decodedKey);
		this.refreshTokenRepository = refreshTokenRepository;
	}

	public String generateAccessToken(String username, String role) {
		Instant nowInstant = Instant.now();
		Instant expiration = nowInstant.plus(15, ChronoUnit.MINUTES);

		String tokenString = Jwts.builder().subject(username).claim("role", role) // Thêm role vào payload
				.issuedAt(Date.from(nowInstant)).expiration(Date.from(expiration)).signWith(key).compact();
		return tokenString;
	}

	@Transactional
	public String generateRefreshToken(String username, String role) {
		Instant now = Instant.now();
		Instant expiration = now.plus(7, ChronoUnit.DAYS);

		String tokenString = Jwts.builder().subject(username).claim("role", role) // Thêm role vào payload
				.id(UUID.randomUUID().toString()).issuedAt(Date.from(now)).expiration(Date.from(expiration))
				.signWith(key).compact();
		RefreshToken refreshToken = new RefreshToken();
		refreshToken.setToken(tokenString);
		refreshToken.setUsername(username);
		refreshToken.setExpiryDate(Date.from(expiration));
		refreshTokenRepository.save(refreshToken);

		return tokenString;
	}

	public Claims verifyToken(String token) {
		try {
			Jws<Claims> jws = Jwts.parser().verifyWith(key).build().parseSignedClaims(token);
			Claims claims = jws.getPayload();
			System.out.println("check jwt claims: " + claims);
			return claims;
		} catch (SignatureException e) {
			throw new IllegalArgumentException("Invalid JWT signature");
		} catch (Exception e) {
			throw new IllegalArgumentException("Invalid or expired JWT token");
		}
	}

	public RefreshToken getRefreshToken(String token) {
		return refreshTokenRepository.findByToken(token)
				.orElseThrow(() -> new IllegalArgumentException("Invalid refresh token"));
	}

	@Transactional
	public void deleteRefreshToken(String token) {
		refreshTokenRepository.deleteByToken(token);
	}
}