package com.mochamates.web.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mochamates.web.entities.User;

public interface UserRepository extends JpaRepository<User, Long> {

//	@Query("SELECT * FORM users WHERE username = ")

	public User findByEmail(String email);

	public User findByUsername(String username);
}
