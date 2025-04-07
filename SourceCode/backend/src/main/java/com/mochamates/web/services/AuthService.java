package com.mochamates.web.services;

import java.util.Date;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mochamates.web.dto.UserRegistrationRequest;
import com.mochamates.web.entities.User;
import com.mochamates.web.exception.UserAlreadyExistException;
import com.mochamates.web.repository.UserRepository;
import com.mochamates.web.validators.UserValidator;

@Service
public class AuthService {
	private VerificationCodeService verificationCodeService;
	private EmailService emailService;
	private UserRepository userRepository;
	private PasswordEncoder passwordEncoder;
	private UserValidator userValidator;

	public AuthService() {

	}

	public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, EmailService emailService,
			VerificationCodeService verificationCodeService, UserValidator userValidator) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.emailService = emailService;
		this.verificationCodeService = verificationCodeService;
		this.userValidator = userValidator;
	}

	@Transactional
	public void registerUser(UserRegistrationRequest userRegistrationRequest) {
		userValidator.validateUser(userRegistrationRequest);

		if (userRepository.findByEmail(userRegistrationRequest.getEmail()) != null)
			throw new UserAlreadyExistException("Email already exist!");

		if (userRepository.findByUsername(userRegistrationRequest.getUsername()) != null)
			throw new UserAlreadyExistException("Username already exist!");

		User newUser = new User(userRegistrationRequest.getUsername(),
				hashPassword(userRegistrationRequest.getPassword()), userRegistrationRequest.getEmail(), null,
				"CUSTOMER", new Date(), null);

		userRepository.save(newUser);

		String codeString = verificationCodeService.genarateVerificatonCode(userRegistrationRequest.getEmail());
		emailService.sendVerificationCode(userRegistrationRequest.getEmail(), codeString);

	}

	public boolean validateUsername(String username) {
		return true;
	}

	public boolean validateEmail(String email) {
		return true;
	}

	public boolean validatePassword(String password) {
		return true;
	}

	private String hashPassword(String password) {
		return passwordEncoder.encode(password);
	}
}
