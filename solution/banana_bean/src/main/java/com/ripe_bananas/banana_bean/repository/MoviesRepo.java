package com.ripe_bananas.banana_bean.repository;

import com.ripe_bananas.banana_bean.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MoviesRepo extends JpaRepository<Movie, Integer>,
  JpaSpecificationExecutor<Movie> {

  @Query("SELECT m FROM Movie m WHERE m.id = :movie_id")
  Movie findMovieDetailById(@Param("movie_id") Integer movie_id);
}
