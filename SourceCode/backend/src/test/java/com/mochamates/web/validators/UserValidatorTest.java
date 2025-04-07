package com.mochamates.web.validators;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import com.mochamates.web.dto.UserRegistrationRequest;
import com.mochamates.web.exception.InvalidUserInfoException;

public class UserValidatorTest {
	private UserValidator userValidator;

	@BeforeEach
	public void setup() {
		this.userValidator = new UserValidator();
	}

	@ParameterizedTest
	@CsvSource({ "nhatphungdev, true", "Nguyenanh**, false", "2003phamnguyen, false", "Ng, false" })
	public void testValidateUsername(String username, boolean expected) {
		boolean isValid = userValidator.validateUsername(username);
		assertEquals(expected, isValid);
	}

	@ParameterizedTest
	@CsvSource({ "nhatphung.dev@gmail.com, true", "nguyena.gmail.com, false", "@gmail.com, false",
			"Phamvan#tien@gmail.com, false,", "h@m, false" })
	public void testValidateEmail(String email, boolean expected) {
		boolean isValid = userValidator.validateEmail(email);
		assertEquals(expected, isValid);
	}

	@ParameterizedTest
	@CsvSource({ "Nhatphung2003, true", "Nhattan, false", "0123456789, false", "Nhat03, false" })
	public void testValidatePassword(String password, boolean expected) {
		boolean isValid = userValidator.validatePassword(password);
		assertEquals(expected, isValid);
	}

	@Test
	void testValidUserInfo() {
		UserRegistrationRequest validUser = new UserRegistrationRequest();
		validUser.setUsername("Nhatphung123");
		validUser.setEmail("nhatphung.dev@gmail.com");
		validUser.setPassword("Nhat2003");

		// Không ném exception
		assertDoesNotThrow(() -> userValidator.validateUser(validUser));
	}

	@Test
	void testInvalidUsername() {
		UserRegistrationRequest invalidUser = new UserRegistrationRequest();
		invalidUser.setUsername("12");
		invalidUser.setEmail("nhatphung.dev@gmail.com");
		invalidUser.setPassword("Nhat2003");

		InvalidUserInfoException ex = assertThrows(InvalidUserInfoException.class,
				() -> userValidator.validateUser(invalidUser));
		assertEquals("Invalid username", ex.getMessage());
	}

	@Test
	void testInvalidEmail() {
		UserRegistrationRequest invalidUser = new UserRegistrationRequest();
		invalidUser.setUsername("Nhatphung123");
		invalidUser.setEmail("gmail.com");
		invalidUser.setPassword("Nhat2003");

		InvalidUserInfoException ex = assertThrows(InvalidUserInfoException.class,
				() -> userValidator.validateUser(invalidUser));
		assertEquals("Invalid Email", ex.getMessage());
	}

	@Test
	void testInvalidPassword() {
		UserRegistrationRequest invalidUser = new UserRegistrationRequest();
		invalidUser.setUsername("Nhatphung123");
		invalidUser.setEmail("nhatphung.dev@gmail.com");
		invalidUser.setPassword("123456");

		InvalidUserInfoException ex = assertThrows(InvalidUserInfoException.class,
				() -> userValidator.validateUser(invalidUser));
		assertEquals("Invalid password", ex.getMessage());
	}
}
