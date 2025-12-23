package com.ripe_bananas.banana_bean.service;

import com.ripe_bananas.banana_bean.entity.BasicMovie;
import com.ripe_bananas.banana_bean.entity.BasicMovieProjection;
import com.ripe_bananas.banana_bean.entity.Movie;
import com.ripe_bananas.banana_bean.repository.BasicMoviesRepo;
import com.ripe_bananas.banana_bean.repository.MoviesRepo;
import com.ripe_bananas.banana_bean.specification_builders.BasicMoviesSpecifications;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class MoviesService {

  private final MoviesRepo movies_repo;

  private final BasicMoviesRepo basic_movies_repo;

  public Page<BasicMovie> findMoviesWithFilters(String name,
                                                List<String> genres,
                                                Float min_rating,
                                                Float max_rating,
                                                Integer min_year,
                                                Integer max_year,
                                                Integer min_duration,
                                                Integer max_duration,
                                                String sort_by,
                                                int page_num,
                                                int page_size) {
    Specification<BasicMovie> specs = BasicMoviesSpecifications.nameLikeTo(name);

    if (genres != null && genres.isEmpty() == false) {
      for (String genre : genres) {
        specs = specs.and(BasicMoviesSpecifications.hasGenre(genre));
      }
    }
    specs = specs
      .and(BasicMoviesSpecifications.ratingGreaterThanOrEqual(min_rating));
    specs = specs
      .and(BasicMoviesSpecifications.ratingLowerThanOrEqual(max_rating));
    specs = specs
      .and(BasicMoviesSpecifications.yearGreatThanOrEqual(min_year));
    specs = specs
      .and(BasicMoviesSpecifications.yearLowerThanOrEqual(max_year));
    specs = specs
      .and(BasicMoviesSpecifications.durationGreaterThanOrEqual(min_duration));
    specs = specs
      .and(BasicMoviesSpecifications.durationLowerThanOrEqual(max_duration));

    Pageable page;
    if (sort_by == null || sort_by.isEmpty() == true) {
      page = PageRequest.of(page_num, page_size);
    } else {
      page = PageRequest.of(page_num, page_size, Sort.by(sort_by));
    }

    Page<BasicMovie> res = basic_movies_repo.findAll(specs, page);

    return res;
  }

  public Movie findMovieDetailsById(Integer movie_id) {
    if (movie_id == null || movie_id <= 1000000) {
      return null;
    }

    Movie response = movies_repo.findMovieDetailById(movie_id);

    return response;
  }

  public Page<BasicMovieProjection> findMoviesWithActor(Integer actor_id,
                                                 int page_num,
                                                 int page_size) {
    if (actor_id == null || actor_id <= 0) {
      return null;
    }

    Pageable page = PageRequest.of(page_num, page_size);
    Page<BasicMovieProjection> movies = movies_repo
      .findMoviesWithActor(actor_id, page);

    return movies;
  }

}
