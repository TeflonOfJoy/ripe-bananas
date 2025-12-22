package com.ripe_bananas.banana_bean.specification_builders;

import com.ripe_bananas.banana_bean.entity.Genre;
import com.ripe_bananas.banana_bean.entity.Movie;
import com.ripe_bananas.banana_bean.entity.Poster;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

public class MoviesSpecifications {

  public static Specification<Movie> nameEqualsTo(String name) {
    return (root, query, criteriaBuilder) -> {
      if (name != null && !name.isEmpty()) {
        return criteriaBuilder.equal(criteriaBuilder.lower(root.get("name")),
          name.toLowerCase());
      }

      return criteriaBuilder.conjunction();
    };
  }

  public static Specification<Movie> nameLikeTo(String name) {
    return (root, query, criteriaBuilder) -> {
      if (name != null && !name.isEmpty()) {
        return criteriaBuilder.like(criteriaBuilder.lower(root.get("name")),
          "%" + name.toLowerCase() + "%");
      }

      return criteriaBuilder.conjunction();
    };
  }

  public static Specification<Movie> yearEqualsTo(Integer year) {
    return (root, query, criteriaBuilder) -> {
      if (year != null && year > 0) {
        return criteriaBuilder.equal(root.get("date"), year);
      }

      return criteriaBuilder.conjunction();
    };
  }

  public static Specification<Movie> yearGreatThanOrEqual(Integer year){
    return (root, query, criteriaBuilder) -> {
      if(year != null && year > 0){
        return criteriaBuilder.greaterThanOrEqualTo(root.get("date"), year);
      }

      return criteriaBuilder.conjunction();
    };
  }

  public static Specification<Movie> yearLowerThanOrEqual(Integer year){
    return (root, query, criteriaBuilder) -> {
      if(year != null && year > 0){
        return criteriaBuilder.lessThanOrEqualTo(root.get("date"), year);
      }

      return criteriaBuilder.conjunction();
    };
  }

  public static Specification<Movie> yearBetween(Integer year_min,
                                                 Integer year_max) {
    return (root, query, criteriaBuilder) -> {
      if(year_min != null && year_max != null){
        var difference = year_min - year_max;
        if(difference <= 0){
          return criteriaBuilder.between(root.get("date"), year_min, year_max);
        }
      }

      return criteriaBuilder.conjunction();
    };
  }

  public static Specification<Movie> ratingGreaterThanOrEqual(Float rating){
    return (root, query, criteriaBuilder) -> {
      if(rating != null && rating >= 0){
        return criteriaBuilder.greaterThanOrEqualTo(root.get("rating"), rating);
      }

      return criteriaBuilder.conjunction();
    };
  }

  public static Specification<Movie> ratingLowerThanOrEqual(Float rating){
    return (root, query, criteriaBuilder) -> {
      if(rating != null && rating >= 0){
        return criteriaBuilder.lessThanOrEqualTo(root.get("rating"), rating);
      }

      return criteriaBuilder.conjunction();
    };
  }

  public static Specification<Movie> ratingBetween(Float rating_min,
                                                   Float rating_max){
    return (root, query, criteriaBuilder) -> {
      if(rating_min != null && rating_max != null){
        var difference = rating_min - rating_max;
        if(difference <= 0){
          return criteriaBuilder.between(root.get("rating"), rating_min,
            rating_max);
        }
      }

      return criteriaBuilder.conjunction();
    };
  }

  public static Specification<Movie> durationGreaterThanOrEqual(Integer duration){
    return (root, query, criteriaBuilder) -> {
      if(duration != null && duration >= 0){
        return criteriaBuilder.greaterThanOrEqualTo(root.get("minute"),
          duration);
      }

      return criteriaBuilder.conjunction();
    };
  }

  public static Specification<Movie> durationLowerThanOrEqual(Integer duration){
    return (root, query, criteriaBuilder) -> {
      if(duration != null && duration >= 0){
        return criteriaBuilder.lessThanOrEqualTo(root.get("minute"), duration);
      }

      return criteriaBuilder.conjunction();
    };
  }

  public static Specification<Movie> durationBetween(Integer duration_min,
                                                     Integer duration_max){
    return (root, query, criteriaBuilder) -> {
      if(duration_min != null && duration_max != null){
        var difference = duration_min - duration_max;
        if(difference <= 0){
          return criteriaBuilder.between(root.get("minute"), duration_min,
            duration_max);
        }
      }

      return criteriaBuilder.conjunction();
    };
  }

  public static Specification<Movie> hasGenre(String genre_name){
    return (root, query, criteriaBuilder) -> {
      if(genre_name != null && !genre_name.isEmpty()){
        Join<Movie, Genre> genre_join = root.join("genres", JoinType.INNER);
        return criteriaBuilder.equal(genre_join.get("genre_name"), genre_name);
      }

      return criteriaBuilder.conjunction();
    };
  }

  public static Specification<Movie> hasPoster(Path<?> movie_id){
    return (root, query, criteriaBuilder) -> {
      if(movie_id != null){
        Join<Movie, Poster> poster_join = root.join("poster", JoinType.INNER);
        return criteriaBuilder.equal(poster_join.get("id"), movie_id);
      }

      return criteriaBuilder.conjunction();
    };
  }

}
