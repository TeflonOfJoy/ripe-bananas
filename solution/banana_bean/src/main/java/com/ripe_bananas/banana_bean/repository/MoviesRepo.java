package com.ripe_bananas.banana_bean.repository;

import com.ripe_bananas.banana_bean.entity.BasicMovieProjection;
import com.ripe_bananas.banana_bean.entity.Movie;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MoviesRepo extends JpaRepository<Movie,  Integer>,
                                    JpaSpecificationExecutor<Movie> {

  @Query("SELECT m FROM Movie m JOIN m.genres g WHERE g.genre_name = " +
    ":genreName")
  Page<BasicMovieProjection> findByGenreName(@Param("genreName") String genreName,
                                             Pageable pageable);

  @Query("SELECT m FROM Movie m WHERE m.id = :movie_id")
  Movie findMovieDetailById(@Param("movie_id") Integer movie_id);

  @Query("SELECT m FROM Movie m JOIN m.actors a WHERE a.id.actor_id = " +
    ":actor_id")
  Page<BasicMovieProjection> findMoviesWithActor(Integer actor_id,
                                                 Pageable page);

}
