package com.ripe_bananas.banana_bean.repository;

import com.ripe_bananas.banana_bean.entity.BasicMovieProjection;
import com.ripe_bananas.banana_bean.entity.Movie;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

  @Query("SELECT m FROM Movie m " +
    "JOIN m.actors a JOIN a.actor ma WHERE ma.id = :actor_id AND " +
    "(:min_rating IS NULL OR m.rating IS NULL OR m.rating >= :min_rating) AND " +
    "(:max_rating IS NULL OR m.rating IS NULL OR m.rating <= :max_rating) AND " +
    "(:min_year IS NULL OR m.date IS NULL OR m.date >= :min_year) AND " +
    "(:max_year IS NULL OR m.date IS NULL OR m.date <= :max_year) AND " +
    "(:min_duration IS NULL OR m.minute IS NULL OR m.minute >= :min_duration) AND " +
    "(:max_duration IS NULL OR m.minute IS NULL OR m.minute <= :max_duration)")
  Page<BasicMovieProjection> findMoviesWithActor(@Param("actor_id") Integer actor_id,
                                                 @Param("min_rating") Float min_rating,
                                                 @Param("max_rating") Float max_rating,
                                                 @Param("min_year") Integer min_year,
                                                 @Param("max_year") Integer max_year,
                                                 @Param("min_duration") Integer min_duration,
                                                 @Param("max_duration") Integer max_duration,
                                                 Pageable page);
}
