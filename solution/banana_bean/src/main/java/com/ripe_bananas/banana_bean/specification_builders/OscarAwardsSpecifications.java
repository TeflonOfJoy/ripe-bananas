package com.ripe_bananas.banana_bean.specification_builders;

import com.ripe_bananas.banana_bean.entity.OscarAward;
import org.springframework.data.jpa.domain.Specification;

public class OscarAwardsSpecifications {

  public static Specification<OscarAward> nameLikeTo(String name) {
    return (root, query, criteriaBuilder) -> {
      if(name != null && name.isEmpty() == false) {
        return criteriaBuilder.like(criteriaBuilder.lower(root.get("name")),
          "%" + name.toLowerCase() + "%");
      }

      return criteriaBuilder.conjunction();
    };
  }

  public static Specification<OscarAward> filmLikeTo(String film_name) {
    return (root, query, criteriaBuilder) -> {
      if(film_name != null && film_name.isEmpty() == false) {
        return criteriaBuilder.like(criteriaBuilder.lower(root.get("film")),
          "%" + film_name.toLowerCase() + "%");
      }

      return criteriaBuilder.conjunction();
    };
  }

  public static Specification<OscarAward> categoryLikeTo(String category) {
    return (root, query, criteriaBuilder) -> {
      if(category != null && category.isEmpty() == false) {
        return criteriaBuilder.like(criteriaBuilder.lower(root.get("category")),
          "%" + category.toLowerCase() + "%");
      }

      return criteriaBuilder.conjunction();
    };
  }

  public static Specification<OscarAward> yearFilmGreaterThanOrEqual(Integer year) {
    return (root, query, criteriaBuilder) -> {
      if(year != null && year > 0){
        return criteriaBuilder.greaterThanOrEqualTo(root.get("year_film"),
          year);
      }

      return criteriaBuilder.conjunction();
    };
  }

  public static Specification<OscarAward> yearFilmLowerThanOrEqual(Integer year) {
    return (root, query, criteriaBuilder) -> {
      if(year != null && year > 0){
        return criteriaBuilder.lessThanOrEqualTo(root.get("year_film"), year);
      }

      return criteriaBuilder.conjunction();
    };
  }

  public static Specification<OscarAward> yearCeremonyGreaterThanOrEqual(Integer year) {
    return (root, query, criteriaBuilder) -> {
      if(year != null && year > 0){
        return criteriaBuilder.greaterThanOrEqualTo(root.get("year_ceremony"),
          year);
      }

      return criteriaBuilder.conjunction();
    };
  }

  public static Specification<OscarAward> yearCeremonyLowerThanOrEqual(Integer year) {
    return (root, query, criteriaBuilder) -> {
      if(year != null && year > 0){
        return criteriaBuilder.lessThanOrEqualTo(root.get("year_ceremony"), year);
      }

      return criteriaBuilder.conjunction();
    };
  }

  public static Specification<OscarAward> ceremonyGreaterThanOrEqual(Integer ceremony) {
    return (root, query, criteriaBuilder) -> {
      if(ceremony != null && ceremony > 0){
        return criteriaBuilder.greaterThanOrEqualTo(root.get("ceremony"), ceremony);
      }

      return criteriaBuilder.conjunction();
    };
  }

  public static Specification<OscarAward> ceremonyLowerThanOrEqual(Integer ceremony) {
    return (root, query, criteriaBuilder) -> {
      if(ceremony != null && ceremony > 0){
        return criteriaBuilder.lessThanOrEqualTo(root.get("ceremony"), ceremony);
      }

      return criteriaBuilder.conjunction();
    };
  }

  public static Specification<OscarAward> winnerEqualsTo(Boolean winner) {
    return (root, query, criteriaBuilder) -> {
      if (winner != null) {
        return criteriaBuilder.equal(root.get("winner"), winner);
      }

      return criteriaBuilder.conjunction();
    };
  }

}
