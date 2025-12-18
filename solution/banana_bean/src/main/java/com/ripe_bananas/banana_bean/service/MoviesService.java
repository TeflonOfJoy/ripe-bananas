package com.ripe_bananas.banana_bean.service;

import com.ripe_bananas.banana_bean.entity.Movie;
import com.ripe_bananas.banana_bean.repository.MoviesRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class MoviesService {

  private final MoviesRepo movies_repo;

  public Page<Movie> findBySpecifiedFilters(Specification<Movie> filters,
                                            int page_number,
                                            int page_size,
                                            String sort_by) {
    Pageable page_info;

    if (sort_by == null) {
      page_info = PageRequest.of(page_number, page_size);
    } else {
      page_info = PageRequest.of(page_number, page_size, Sort.by(sort_by));
    }

    return movies_repo.findAll(filters, page_info);
  }
}
