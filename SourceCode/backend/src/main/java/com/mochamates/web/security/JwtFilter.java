package com.mochamates.web.security;

import java.util.Collections;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.mochamates.web.exception.InvalidUserInfoException;
import com.mochamates.web.services.TokenService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.io.IOException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {

	private final TokenService tokenService;

	public JwtFilter(TokenService tokenService) {
		this.tokenService = tokenService;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
			throws ServletException, IOException, java.io.IOException {
		String authHeader = request.getHeader("Authorization");
		if (authHeader == null || !authHeader.startsWith("Bearer ")) {
			chain.doFilter(request, response);
			return;
		}

		try {
			String token = authHeader.substring(7);
			Claims claims = tokenService.verifyToken(token);

			String userId = claims.getSubject();
			String role = claims.get("role", String.class);
			List<SimpleGrantedAuthority> authorities = role != null
					? Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role))
					: Collections.emptyList();

			UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(userId, null,
					authorities);
			SecurityContextHolder.getContext().setAuthentication(auth);
			System.out.println(SecurityContextHolder.getContext());
		} catch (Exception e) {
			System.out.println("loi o day");
			throw new InvalidUserInfoException();
		}

		chain.doFilter(request, response);
	}
}