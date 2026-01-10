package com.ripe_bananas.banana_bean.service;

import com.ripe_bananas.banana_bean.entity.OscarAward;
import com.ripe_bananas.banana_bean.repository.OscarAwardsRepo;
import com.ripe_bananas.banana_bean.specification_builders.OscarAwardsSpecifications;
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
public class OscarAwardsService {

  private final OscarAwardsRepo oscar_repo;

  public Page<OscarAward> findOscarAwardsWithFilers(String name,
                                                    String film_name,
                                                    String category,
                                                    Integer min_year_film,
                                                    Integer max_year_film,
                                                    Integer min_year_ceremony,
                                                    Integer max_year_ceremony,
                                                    Integer min_ceremony,
                                                    Integer max_ceremony,
                                                    Boolean winner,
                                                    String sort_by,
                                                    int page_num,
                                                    int page_size) {
    Specification<OscarAward> specs =
      OscarAwardsSpecifications.nameLikeTo(name);
    specs = specs
      .and(OscarAwardsSpecifications.filmLikeTo(film_name));
    specs = specs
      .and(OscarAwardsSpecifications.categoryLikeTo(category));
    specs = specs
      .and(OscarAwardsSpecifications.yearFilmGreaterThanOrEqual(min_year_film));
    specs = specs
      .and(OscarAwardsSpecifications.yearFilmLowerThanOrEqual(max_year_film));
    specs = specs
      .and(OscarAwardsSpecifications.yearCeremonyGreaterThanOrEqual(min_year_ceremony));
    specs = specs
      .and(OscarAwardsSpecifications.yearCeremonyLowerThanOrEqual(max_year_ceremony));
    specs = specs
      .and(OscarAwardsSpecifications.ceremonyGreaterThanOrEqual(min_ceremony));
    specs = specs
      .and(OscarAwardsSpecifications.ceremonyLowerThanOrEqual(max_ceremony));
    specs = specs
      .and(OscarAwardsSpecifications.winnerEqualsTo(winner));

    Pageable page;
    if (sort_by != null && sort_by.isEmpty() == false) {
      page = PageRequest.of(page_num, page_size, Sort.by(sort_by));
    } else {
      page = PageRequest.of(page_num, page_size);
    }

    Page<OscarAward> oscar_awards = oscar_repo
      .findAll(specs, page);

    return oscar_awards;
  }

}
