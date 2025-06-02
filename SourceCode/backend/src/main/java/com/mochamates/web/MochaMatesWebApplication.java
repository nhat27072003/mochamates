package com.mochamates.web;

import java.util.TimeZone;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.mochamates.web.security.DotenvConfig;

import jakarta.annotation.PostConstruct;

@SpringBootApplication
public class MochaMatesWebApplication {

	public static void main(String[] args) {
		DotenvConfig.init();
		TimeZone.setDefault(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
		SpringApplication.run(MochaMatesWebApplication.class, args);
	}

	@PostConstruct
	public void init() {
		TimeZone.setDefault(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
		System.out.println("Default timezone set to: " + TimeZone.getDefault().getID());
	}
}
