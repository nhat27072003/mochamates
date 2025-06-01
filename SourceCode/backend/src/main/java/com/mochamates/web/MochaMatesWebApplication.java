package com.mochamates.web;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.mochamates.web.security.DotenvConfig;

@SpringBootApplication
public class MochaMatesWebApplication {

	public static void main(String[] args) {
		DotenvConfig.init();
		SpringApplication.run(MochaMatesWebApplication.class, args);
	}

}
