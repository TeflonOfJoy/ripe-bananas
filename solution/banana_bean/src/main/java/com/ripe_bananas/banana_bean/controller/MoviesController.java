package com.ripe_bananas.banana_bean.controller;

import com.ripe_bananas.banana_bean.entity.Movie;
import com.ripe_bananas.banana_bean.service.MoviesService;
import com.ripe_bananas.banana_bean.specification_builders.MoviesSpecifications;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/banana_bean_api")
@RequiredArgsConstructor
@Validated
@Slf4j
public class MoviesController {

    private final MoviesService movies_service;

    @GetMapping("/get_movies")
    public ResponseEntity<Page<Movie>> getMovies(
            @RequestParam(required = false) String movie_name,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Float min_rating,
            @RequestParam(required = false) Float max_rating,
            @RequestParam(required = false) Integer min_duration,
            @RequestParam(required = false) Integer max_duration,
            @RequestParam(required = false) String sort_by,
            @RequestParam(value = "page_num", defaultValue = "0") int page_num,
            @RequestParam(value = "page_sz", defaultValue = "25") int page_size
    ) {
        log.info("min rating {} | max rating {}", min_rating, max_rating);
        Specification<Movie> moviesSpecifications = MoviesSpecifications
                .withFilters(
                        movie_name,
                        year,
                        min_rating,
                        max_rating,
                        min_duration,
                        max_duration
                );

        Pageable page_info;
        if(sort_by != null) {
            page_info = PageRequest.of(page_num, page_size, Sort.by(sort_by));
        } else {
            page_info = PageRequest.of(page_num, page_size);
        }

        Page<Movie> movie_page_response = movies_service.findBySpecifiedFilters(
                moviesSpecifications,
                page_info
        );

        if(movie_page_response != null){
            return ResponseEntity.ok(movie_page_response);
        }

        return ResponseEntity.notFound().build();
    }
}
