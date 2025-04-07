package com.mochamates.web.services;

import java.time.LocalDateTime;

public class VerificationEntry {
	private final String code;
	private final LocalDateTime expireTime;

	public VerificationEntry(String code, LocalDateTime expireTime) {
		this.code = code;
		this.expireTime = expireTime;
	}

	public String getCode() {
		return this.code;
	}

	public LocalDateTime getExpireTime() {
		return this.expireTime;
	}
}
