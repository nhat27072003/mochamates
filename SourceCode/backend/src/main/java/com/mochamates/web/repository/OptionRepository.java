package com.mochamates.web.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mochamates.web.entities.products.Option;

@Repository
public interface OptionRepository extends JpaRepository<Option, Long> {

	List<Option> findByName(String name);

}
