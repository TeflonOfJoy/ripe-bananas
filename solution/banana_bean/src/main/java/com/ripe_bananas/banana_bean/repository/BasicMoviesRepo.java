package com.ripe_bananas.banana_bean.repository;

import com.ripe_bananas.banana_bean.entity.BasicMovie;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface BasicMoviesRepo extends JpaRepository<BasicMovie, Integer>,
  JpaSpecificationExecutor<BasicMovie> {
}
