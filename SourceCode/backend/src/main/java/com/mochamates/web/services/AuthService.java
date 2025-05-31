package com.mochamates.web.services;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mochamates.web.dto.auth.RefreshTokenResponse;
import com.mochamates.web.dto.auth.UserLoginRequest;
import com.mochamates.web.dto.auth.UserRegistrationRequest;
import com.mochamates.web.dto.auth.VerificaionRequest;
import com.mochamates.web.entities.RefreshToken;
import com.mochamates.web.entities.User;
import com.mochamates.web.exception.EmailNotVerifiedException;
import com.mochamates.web.exception.InvalidPasswordException;
import com.mochamates.web.exception.InvalidRefreshTokenException;
import com.mochamates.web.exception.InvalidVerificationCode;
import com.mochamates.web.exception.UserAlreadyExistException;
import com.mochamates.web.exception.UserNotFoundException;
import com.mochamates.web.exception.VerificationCodeException;
import com.mochamates.web.repository.RefreshTokenRepository;
import com.mochamates.web.repository.UserRepository;
import com.mochamates.web.validators.UserValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Service that handles user authentication and registration logic, including
 * login, verification, refresh token handling, and sending verification codes.
 */
@Service
public class AuthService {
	private VerificationCodeService verificationCodeService;
	private EmailService emailService;
	private UserRepository userRepository;
	private PasswordEncoder passwordEncoder;
	private UserValidator userValidator;
	private TokenService tokenService;
	private RefreshTokenRepository refreshTokenRepository;
	private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

	/**
	 * Constructor to initialize the AuthService with required dependencies.
	 */
	public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, EmailService emailService,
			VerificationCodeService verificationCodeService, TokenService tokenService,
			RefreshTokenRepository refreshTokenRepository) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.emailService = emailService;
		this.verificationCodeService = verificationCodeService;
		this.userValidator = new UserValidator();
		this.tokenService = tokenService;
		this.refreshTokenRepository = refreshTokenRepository;
	}

	/**
	 * Logs in a user by verifying credentials and generating JWT tokens.
	 *
	 * @param userRequest login request containing username/email and password
	 * @return a response containing access and refresh tokens, username, and role
	 */
	public Map<String, String> login(UserLoginRequest userRequest) {
		User user = userRepository.findByUsernameOrEmail(userRequest.getUsernameOrEmail(),
				userRequest.getUsernameOrEmail());
		if (user == null)
			throw new UserNotFoundException();

		if (!isPasswordValid(userRequest.getPassword(), user.getPassword())) {
			throw new InvalidPasswordException();
		}
		if (!user.isVerify())
			throw new EmailNotVerifiedException();

		String accessToken = tokenService.generateAccessToken(user.getUsername(), user.getRole());
		String refreshToken = tokenService.generateRefreshToken(user.getUsername(), user.getRole());

		Map<String, String> tokens = new HashMap<>();
		tokens.put("accessToken", accessToken);
		tokens.put("refreshToken", refreshToken);
		return tokens;

	}

	/**
	 * Validates a user's password.
	 *
	 * @param rawPassword     the plain text password
	 * @param encodedPassword the encoded password stored in the database
	 * @return true if the passwords match, false otherwise
	 */
	private boolean isPasswordValid(String rawPassword, String encodedPassword) {
		return passwordEncoder.matches(rawPassword, encodedPassword);
	}

	/**
	 * Registers a new user and sends a verification code to their email.
	 *
	 * @param userRegistrationRequest user registration data
	 */
	@Transactional
	public void registerUser(UserRegistrationRequest userRegistrationRequest) {
		userValidator.validateUser(userRegistrationRequest);
		logger.info("check registerv " + userRegistrationRequest.getUsername());
		if (userRepository.findByEmail(userRegistrationRequest.getEmail()) != null)
			throw new UserAlreadyExistException("Email already exists!");

		Optional<User> user = userRepository.findByUsername(userRegistrationRequest.getUsername());
		if (user.isPresent())
			throw new UserAlreadyExistException("Username already exists!");

		User newUser = new User(userRegistrationRequest.getUsername(),
				hashPassword(userRegistrationRequest.getPassword()), userRegistrationRequest.getEmail(), null,
				"CUSTOMER", new Date(), null);

		userRepository.save(newUser);

		String codeString = verificationCodeService.genarateVerificatonCode(userRegistrationRequest.getEmail());
		emailService.sendVerificationCode(userRegistrationRequest.getEmail(), codeString);
	}

	/**
	 * Resends the email verification code to a user.
	 *
	 * @param email the user's email address
	 */
	public void reGenerateCode(String usernameOrEmail) {
		User user = userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail);
		if (user == null)
			throw new UserNotFoundException();

		String codeString = verificationCodeService.genarateVerificatonCode(user.getEmail());
		emailService.sendVerificationCode(user.getEmail(), codeString);
	}

	/**
	 * Verifies a user's account using a code sent to their email.
	 *
	 * @param verificaionRequest contains email, username, password, and
	 *                           verification code
	 */
	public void verification(VerificaionRequest verificaionRequest) {
		if (verificaionRequest.getUsernameOrEmail() == null || verificaionRequest.getCode() == null)
			throw new VerificationCodeException();

		User user = userRepository.findByUsernameOrEmail(verificaionRequest.getUsernameOrEmail(),
				verificaionRequest.getUsernameOrEmail());
		if (user == null) {
			throw new UserNotFoundException();
		}

		boolean verify = verificationCodeService.verifyCode(user.getEmail(), verificaionRequest.getCode());

		if (verify) {
			user.setVerify(true);
			userRepository.save(user);
		} else {
			throw new InvalidVerificationCode();
		}
	}

	/**
	 * Hashes a password using the configured password encoder.
	 *
	 * @param password plain text password
	 * @return encoded password
	 */
	private String hashPassword(String password) {
		return passwordEncoder.encode(password);
	}

	/**
	 * Refreshes an access token using a valid refresh token.
	 *
	 * @param refreshTokenString the refresh token string
	 * @return a response containing a new access token and the username
	 */
	public RefreshTokenResponse refreshToken(String refreshTokenString) {
		Optional<RefreshToken> refeshTokenOptional = refreshTokenRepository.findByToken(refreshTokenString);

		if (refeshTokenOptional.isEmpty()) {
			throw new InvalidRefreshTokenException();
		}

		RefreshToken refreshToken = refeshTokenOptional.get();

		if (refreshToken.getExpiryDate().before(new Date())) {
			refreshTokenRepository.deleteByToken(refreshTokenString);
			throw new InvalidRefreshTokenException();
		}
		User user = userRepository.findByUsername(refreshToken.getUsername())
				.orElseThrow(() -> new UserNotFoundException());
		String newAccessToken = tokenService.generateAccessToken(user.getUsername(), user.getRole());

		return new RefreshTokenResponse(newAccessToken, refreshToken.getUsername());
	}
}
