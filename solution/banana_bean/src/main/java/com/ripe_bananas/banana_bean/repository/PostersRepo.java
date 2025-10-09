package com.ripe_bananas.banana_bean.repository;

import com.ripe_bananas.banana_bean.entity.Poster;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostersRepo extends JpaRepository<Poster, Integer> {
}
