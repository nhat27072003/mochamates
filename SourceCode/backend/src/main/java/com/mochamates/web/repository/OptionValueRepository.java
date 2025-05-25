package com.mochamates.web.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mochamates.web.entities.products.OptionValue;

public interface OptionValueRepository extends JpaRepository<OptionValue, Long> {

	void deleteByOptionId(Long id);

}
