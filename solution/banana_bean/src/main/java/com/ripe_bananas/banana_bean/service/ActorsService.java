package com.ripe_bananas.banana_bean.service;

import com.ripe_bananas.banana_bean.entity.Actor;
import com.ripe_bananas.banana_bean.repository.ActorsRepo;
import com.ripe_bananas.banana_bean.utility.Utility;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActorsService {

  private final ActorsRepo actors_repo;

  public Page<Actor> searchActorByName(String name,
                                       String sort_by,
                                       String sort_direction,
                                       int page_num,
                                       int page_size){
    Pageable page;

    Sort sort = Utility.buildSortBy(sort_by, sort_direction);
    if (sort == null) {
      page = PageRequest.of(page_num, page_size);
    } else {
      page = PageRequest.of(page_num, page_size, sort);
    }

    return actors_repo.findByName(name, page);
  }

}
