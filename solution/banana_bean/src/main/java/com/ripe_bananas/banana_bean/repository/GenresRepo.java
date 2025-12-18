package com.ripe_bananas.banana_bean.repository;

import com.ripe_bananas.banana_bean.entity.Genre;
import com.ripe_bananas.banana_bean.entity.Movie;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface GenresRepo extends JpaRepository<Genre, Integer>,
  JpaSpecificationExecutor<Genre> {

  @Query("SELECT g FROM Genre g JOIN g.movies m WHERE m.id = :movieId")
  Page<Movie> findByMovieId(@Param("movieId") Integer movieId,
                            Pageable pageable);

}
