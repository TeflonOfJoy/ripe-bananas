package com.ripe_bananas.banana_bean.service;

import com.ripe_bananas.banana_bean.entity.Movie;
import com.ripe_bananas.banana_bean.repository.MoviesRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class MoviesService {
    private final MoviesRepo movies_repo;

    public Page<Movie> findBySpecifiedFilters(Specification<Movie> filters,
                                              Pageable page_info
    ) {
        Page<Movie> response_page = movies_repo.findAll(filters, page_info);

        if(response_page.getTotalElements() > 0){
            return response_page;
        }

        return null;
    }
}
