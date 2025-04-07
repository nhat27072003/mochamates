package com.mochamates.web.services;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
	private JavaMailSender javaMailSender;

	public EmailService(JavaMailSender javaMailSender) {
		this.javaMailSender = javaMailSender;
	}

	public void sendVerificationCode(String email, String code) {
		String subjectString = "Your Verification Code";
		String body = "Your verification code is:" + code + "\nThis code will expire in 5 minutes.";

		sendEmail(email, subjectString, body);
	}

	private void sendEmail(String to, String subject, String body) {
		SimpleMailMessage message = new SimpleMailMessage();

		message.setTo(to);
		message.setSubject(subject);
		message.setText(body);
		message.setFrom("nhattan28062003@gmail.com");

		javaMailSender.send(message);
	}
}
