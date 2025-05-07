package com.mochamates.web.validators;

import org.springframework.stereotype.Component;

import com.mochamates.web.dto.auth.UserRegistrationRequest;
import com.mochamates.web.exception.InvalidUserInfoException;

@Component
public class UserValidator {
	public UserValidator() {

	}

	public void validateUser(UserRegistrationRequest userRegistrationRequest) {
		if (!validateUsername(userRegistrationRequest.getUsername()))
			throw new InvalidUserInfoException("Invalid username");

		if (!validateEmail(userRegistrationRequest.getEmail()))
			throw new InvalidUserInfoException("Invalid Email");

		if (!validatePassword(userRegistrationRequest.getPassword()))
			throw new InvalidUserInfoException("Invalid password");
	}

	public boolean validateUsername(String username) {
		if (username == null) {
			return false;
		}

		return username.matches("^[a-zA-Z][a-zA-Z0-9]{2,49}$");
	}

	public boolean validateEmail(String email) {
		if (email == null) {
			return false;
		}
		return email.matches("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$");
	}

	public boolean validatePassword(String password) {
		if (password == null) {
			return false;
		}
		if (password.length() < 8 || password.length() > 50)
			return false;

		return password.matches("^(?=.*[A-Za-z])(?=.*\\d).+$");
	}
}
