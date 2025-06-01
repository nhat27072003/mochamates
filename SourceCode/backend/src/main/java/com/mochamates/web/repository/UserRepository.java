package com.mochamates.web.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.mochamates.web.entities.User;

public interface UserRepository extends JpaRepository<User, Long> {

//	@Query("SELECT * FORM users WHERE username = ")

	public User findByEmail(String email);

	Optional<User> findByUsername(String username);

	@Query("SELECT u FROM User u WHERE u.username = :username OR u.email = :email")
	public User findByUsernameOrEmail(@Param("username") String username, @Param("email") String email);

//	@Query("SELECT u FROM User u WHERE u.create_at BETWEEN :dateFrom AND :dateTo")
//	List<User> findByCreateAtBetween(@Param("dateFrom") LocalDateTime dateFrom, @Param("dateTo") LocalDateTime dateTo);

	long countByRole(String role);

//	@Query("SELECT COUNT(u) FROM User u WHERE u.createAt >= :startDate")
//	long countByCreateAtAfter(@Param("startDate") LocalDateTime startDate);
	Page<User> findByRole(String role, Pageable pageable);
}
