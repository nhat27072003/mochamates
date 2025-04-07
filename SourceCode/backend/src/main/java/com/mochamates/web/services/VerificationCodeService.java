package com.mochamates.web.services;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

@Service
public class VerificationCodeService {
	private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	private final int CODE_LENGTH = 6;
	private final static long EXPIRE_MINUTES = 5;
	private final SecureRandom secureRandom = new SecureRandom();
	private final Map<String, VerificationEntry> verifications = new ConcurrentHashMap<>();

	public VerificationCodeService() {

	}

	public String genarateVerificatonCode(String email) {
		StringBuilder codeBuilder = new StringBuilder(CODE_LENGTH);
		for (int i = 0; i < CODE_LENGTH; i++) {
			int index = secureRandom.nextInt(CHARACTERS.length());
			codeBuilder.append(CHARACTERS.charAt(index));
		}
		String code = codeBuilder.toString();
		LocalDateTime expireTime = LocalDateTime.now().plusMinutes(EXPIRE_MINUTES);
		verifications.put(email, new VerificationEntry(code, expireTime));
		return code;
	}

	public boolean verifyCode(String email, String code) {
		VerificationEntry info = verifications.get(email);
		if (info == null) {
			return false;
		}

		if (LocalDateTime.now().isAfter(info.getExpireTime())) {
			verifications.remove(email);
			return false;
		}
		verifications.forEach((mail, entry) -> {
			System.out.println(
					"Email: " + mail + ", Code: " + entry.getCode() + ", Expire Time: " + entry.getExpireTime());
		});
		return info.getCode().equals(code);
	}
}
