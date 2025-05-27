package com.mochamates.web.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mochamates.web.entities.review.ReviewReply;

public interface ReviewReplyRepository extends JpaRepository<ReviewReply, Long> {
	List<ReviewReply> findByReviewId(Long reviewId);
}
