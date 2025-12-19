package com.ripe_bananas.banana_bean.service;

import com.ripe_bananas.banana_bean.entity.Movie;
import com.ripe_bananas.banana_bean.repository.GenresRepo;
import com.ripe_bananas.banana_bean.repository.MoviesRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class MoviesGenresService {

  private final MoviesRepo movies_repo;
  private final GenresRepo genres_repo;

  public Page<Movie> getMoviesGenres(String genre_name) {
    int page_number = 0;
    int page_size = 50;

    log.info("genre name {}", genre_name);
    Pageable pageable = PageRequest.of(page_number, page_size);

    return movies_repo.findByGenreName(genre_name, pageable);
  }
}
