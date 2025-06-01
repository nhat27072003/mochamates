package com.mochamates.web.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.github.cdimascio.dotenv.Dotenv;
import io.github.cdimascio.dotenv.DotenvException;

public class DotenvConfig {
	private static final Logger logger = LoggerFactory.getLogger(DotenvConfig.class);

	public static void init() {
		try {
			Dotenv dotenv = Dotenv.configure().directory(System.getProperty("user.dir")) // Project root
					.ignoreIfMissing() // Don't fail if .env is missing
					.load();
			dotenv.entries().forEach(entry -> {
				System.setProperty(entry.getKey(), entry.getValue());
				logger.debug("Loaded env variable: {}={}", entry.getKey(), entry.getValue());
			});
			logger.info(".env file loaded successfully from {}", System.getProperty("user.dir"));
		} catch (DotenvException e) {
			logger.error("Failed to load .env file: {}", e.getMessage());
			throw new RuntimeException("Could not load .env file", e);
		}
	}
}