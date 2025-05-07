package com.mochamates.web.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mochamates.web.entities.RefreshToken;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, String> {
	Optional<RefreshToken> findByToken(String token);

	void deleteByToken(String token);
}
