package com.mochamates.web.service.authservice;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import com.mochamates.web.services.AuthService;

public class ValidateUsernameTest {
	private AuthService authService;

	@BeforeEach
	public void setup() {
		authService = new AuthService();
	}

	@ParameterizedTest
	@CsvSource({ "123344, true" })
	public void validateUsernameTest(String username, boolean expected) {
		boolean isValid = authService.validateUsername(username);
		assertEquals(expected, isValid);
	}

	@ParameterizedTest
	@CsvSource({ "nhat2806200@gmail.com, true" })
	public void testEmail(String email, boolean expected) {
		boolean isValid = authService.validateEmail(email);
		assertEquals(expected, isValid);
	}
}
