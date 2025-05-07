package com.mochamates.web.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.mochamates.web.entities.User;

public interface UserRepository extends JpaRepository<User, Long> {

//	@Query("SELECT * FORM users WHERE username = ")

	public User findByEmail(String email);

	public User findByUsername(String username);

	@Query("SELECT u FROM User u WHERE u.username = :username OR u.email = :email")
	public User findByUsernameOrEmail(@Param("username") String username, @Param("email") String email);
}
