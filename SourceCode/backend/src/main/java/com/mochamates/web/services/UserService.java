package com.mochamates.web.services;

import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.mochamates.web.dto.user.ChangePasswordRequestDTO;
import com.mochamates.web.dto.user.GetUsersResponseDTO;
import com.mochamates.web.dto.user.UserCreateRequestDTO;
import com.mochamates.web.dto.user.UserDetailResponse;
import com.mochamates.web.dto.user.UserProfileUpdateRequestDTO;
import com.mochamates.web.dto.user.UserUpdateRequestDTO;
import com.mochamates.web.entities.User;
import com.mochamates.web.exception.InvalidUserInfoException;
import com.mochamates.web.exception.UserNotFoundException;
import com.mochamates.web.repository.UserRepository;

@Service
public class UserService {
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
	}

	public UserDetailResponse getUserProfile(String username) {
		User user = userRepository.findByUsername(username)
				.orElseThrow(() -> new UserNotFoundException("User not found: " + username));

		return mapToUserDetailResponse(user);
	}

	public UserDetailResponse getUserById(Long id) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new UserNotFoundException("User not found with ID: " + id));

		return mapToUserDetailResponse(user);
	}

	public boolean isUserExist(Long userId) {
		return userRepository.findById(userId).isPresent();
	}

	public UserDetailResponse createUser(UserCreateRequestDTO request) {
		// Validate request
		validateCreateRequest(request);

		// Check if username or email exists
		User existingUser = userRepository.findByUsernameOrEmail(request.getUsername(), request.getEmail());
		if (existingUser != null) {
			if (existingUser.getUsername().equals(request.getUsername())) {
				throw new InvalidUserInfoException("Username already exists: " + request.getUsername());
			}
			if (existingUser.getEmail().equals(request.getEmail())) {
				throw new InvalidUserInfoException("Email already exists: " + request.getEmail());
			}
		}

		// Create new user
		User user = new User();
		user.setUsername(request.getUsername());
		user.setPassword(passwordEncoder.encode(request.getPassword()));
		user.setEmail(request.getEmail());
		user.setPhone(request.getPhone());
		user.setRole(request.getRole());
		user.setCreate_at(new Date());
		user.setUpdate_at(new Date());
		user.setVerify(false); // Default: not verified

		userRepository.save(user);

		return mapToUserDetailResponse(user);
	}

	public UserDetailResponse updateUser(Long id, UserUpdateRequestDTO request) {
		// Find user
		User user = userRepository.findById(id)
				.orElseThrow(() -> new UserNotFoundException("User not found with ID: " + id));

		// Validate request
		validateUpdateRequest(request, id);

		// Check if new email is taken by another user
		if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
			User existingUser = userRepository.findByEmail(request.getEmail());
			if (existingUser != null && !existingUser.getId().equals(id)) {
				throw new InvalidUserInfoException("Email already exists: " + request.getEmail());
			}
			user.setEmail(request.getEmail());
		}

		// Update fields
		if (request.getPhone() != null) {
			user.setPhone(request.getPhone());
		}
		if (request.getRole() != null) {
			if (!Set.of("ADMIN", "CUSTOMER").contains(request.getRole())) {
				throw new InvalidUserInfoException("Invalid role: " + request.getRole());
			}
			user.setRole(request.getRole());
		}
		if (request.getPassword() != null) {
			user.setPassword(passwordEncoder.encode(request.getPassword()));
		}
		if (request.getIsVerify() != null) {
			user.setVerify(request.getIsVerify());
		}
		user.setUpdate_at(new Date());

		userRepository.save(user);

		return mapToUserDetailResponse(user);
	}

	public UserDetailResponse updateUserProfile(UserProfileUpdateRequestDTO request) {
		// Get current user
		String username = SecurityContextHolder.getContext().getAuthentication().getName();
		User user = userRepository.findByUsername(username)
				.orElseThrow(() -> new UserNotFoundException("User not found: " + username));

		// Validate request
		if (request.getEmail() != null && request.getEmail().isBlank()) {
			throw new InvalidUserInfoException("Email cannot be empty");
		}
		if (request.getPhone() != null && request.getPhone().isBlank()) {
			throw new InvalidUserInfoException("Phone cannot be empty");
		}

		// Check if new email is taken
		if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
			User existingUser = userRepository.findByEmail(request.getEmail());
			if (existingUser != null && !existingUser.getId().equals(user.getId())) {
				throw new InvalidUserInfoException("Email already exists: " + request.getEmail());
			}
			user.setEmail(request.getEmail());
		}

		// Update fields
		if (request.getPhone() != null) {
			user.setPhone(request.getPhone());
		}
		user.setUpdate_at(new Date());

		userRepository.save(user);

		return mapToUserDetailResponse(user);
	}

	public void changePassword(ChangePasswordRequestDTO request) {
		// Get current user
		String username = SecurityContextHolder.getContext().getAuthentication().getName();
		User user = userRepository.findByUsername(username)
				.orElseThrow(() -> new UserNotFoundException("User not found: " + username));

		// Validate request
		if (request.getOldPassword() == null || request.getOldPassword().isBlank()) {
			throw new InvalidUserInfoException("Old password is required");
		}
		if (request.getNewPassword() == null || request.getNewPassword().isBlank()) {
			throw new InvalidUserInfoException("New password is required");
		}
		if (request.getNewPassword().length() < 8) {
			throw new InvalidUserInfoException("New password must be at least 8 characters");
		}

		// Verify old password
		if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
			throw new InvalidUserInfoException("Old password is incorrect");
		}

		// Update password
		user.setPassword(passwordEncoder.encode(request.getNewPassword()));
		user.setUpdate_at(new Date());

		userRepository.save(user);
	}

	public GetUsersResponseDTO getUsers(int page, int size) {
		if (page < 0 || size <= 0) {
			throw new InvalidUserInfoException("Page index must be >= 0 and size > 0.");
		}

		GetUsersResponseDTO response = new GetUsersResponseDTO();
		try {
			Pageable pageable = PageRequest.of(page, size);
			Page<User> userPage = userRepository.findAll(pageable);

			List<UserDetailResponse> userDTOs = userPage.getContent().stream().map(this::mapToUserDetailResponse)
					.collect(Collectors.toList());

			response.setUsers(userDTOs);
			response.setCurrentPage(userPage.getNumber());
			response.setTotalItems(userPage.getTotalElements());
			response.setTotalPages(userPage.getTotalPages());
		} catch (Exception e) {
			throw new InvalidUserInfoException("Failed to retrieve users: " + e.getMessage());
		}

		return response;
	}

	public UserDetailResponse deleteUser(Long id) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new UserNotFoundException("User not found with ID: " + id));

		UserDetailResponse response = mapToUserDetailResponse(user);
		userRepository.deleteById(id);

		return response;
	}

	private UserDetailResponse mapToUserDetailResponse(User user) {
		UserDetailResponse response = new UserDetailResponse();
		response.setUsername(user.getUsername());
		response.setEmail(user.getEmail());
		response.setPhone(user.getPhone());
		response.setRole(user.getRole());
		response.setVerify(user.isVerify());
		return response;
	}

	private void validateCreateRequest(UserCreateRequestDTO request) {
		if (request.getUsername() == null || request.getUsername().isBlank()) {
			throw new InvalidUserInfoException("Username is required");
		}
		if (request.getPassword() == null || request.getPassword().isBlank()) {
			throw new InvalidUserInfoException("Password is required");
		}
		if (request.getEmail() == null || request.getEmail().isBlank()) {
			throw new InvalidUserInfoException("Email is required");
		}
		if (!Set.of("ADMIN", "CUSTOMER").contains(request.getRole())) {
			throw new InvalidUserInfoException("Invalid role: " + request.getRole());
		}
	}

	private void validateUpdateRequest(UserUpdateRequestDTO request, Long id) {
		if (request.getEmail() != null && request.getEmail().isBlank()) {
			throw new InvalidUserInfoException("Email cannot be empty");
		}
		if (request.getPhone() != null && request.getPhone().isBlank()) {
			throw new InvalidUserInfoException("Phone cannot be empty");
		}
		if (request.getPassword() != null && request.getPassword().isBlank()) {
			throw new InvalidUserInfoException("Password cannot be empty");
		}
	}
}