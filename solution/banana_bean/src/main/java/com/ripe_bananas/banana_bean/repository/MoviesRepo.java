package com.ripe_bananas.banana_bean.repository;

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

  @Query("SELECT m FROM Movie m JOIN m.genres g WHERE g.genre_id = " +
    ":genreId")
  Page<Movie> findByGenreId(@Param("genreId") String genreName,
                            Pageable pageable);

  @Query("SELECT m FROM Movie m JOIN m.genres g WHERE g.genre_name = " +
    ":genreName")
  Page<Movie> findByGenreName(@Param("genreName") String genreName,
                              Pageable pageable);

  @Query("SELECT m FROM Movie m JOIN m.genres g JOIN m.poster p where m.id = " +
    ":movie_id")
  Movie findMovieDetailById(@Param("movie_id") Integer movie_id);

}
