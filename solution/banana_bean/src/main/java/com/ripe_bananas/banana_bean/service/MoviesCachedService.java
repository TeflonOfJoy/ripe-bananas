package com.ripe_bananas.banana_bean.service;

import com.ripe_bananas.banana_bean.entity.Movie;
import com.ripe_bananas.banana_bean.repository.MoviesRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class MoviesCachedService {

    private final MoviesRepo movies_repo;

    @Cacheable(value = "movies_search", key = "#cache_key")
    public Page<Movie> fetchCachedMovies(String cache_key,
                                         Specification<Movie> filters,
                                         String sort_by) {
        log.info("Cache miss: Fetching 1000 movies from db for cache: {}",
                cache_key);
        Pageable page_info = PageRequest
                .of(0, 1000, Sort.by(sort_by));
        return movies_repo.findAll(filters, page_info);
    }

}
