package com.mochamates.web.services;

import org.springframework.stereotype.Service;

import com.mochamates.web.dto.user.UserDetailResponse;
import com.mochamates.web.entities.User;
import com.mochamates.web.exception.UserNotFoundException;
import com.mochamates.web.repository.UserRepository;

@Service
public class UserService {
	private UserRepository userRepository;

	public UserService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	public UserDetailResponse getUserProfile(String username) {
		User user = userRepository.findByUsername(username);
		if (user == null)
			throw new UserNotFoundException();

		UserDetailResponse userRes = new UserDetailResponse();
		userRes.setUsername(username);
		userRes.setEmail(user.getEmail());
		userRes.setRole(user.getRole());

		return userRes;
	}
}
