package com.ripe_bananas.banana_bean.specification_builders;

import com.ripe_bananas.banana_bean.entity.*;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public class BasicMoviesSpecifications {

  public static Specification<BasicMovie> nameEqualsTo(String name) {
    return (root, query, criteriaBuilder) -> {
      if (name != null && !name.isEmpty()) {
        return criteriaBuilder.equal(criteriaBuilder.lower(root.get("name")),
          name.toLowerCase());
      }

      return criteriaBuilder.conjunction();
    };
  }

  public static Specification<BasicMovie> nameLikeTo(String name) {
    return (root, query, criteriaBuilder) -> {
      if (name != null && !name.isEmpty()) {
        return criteriaBuilder.like(criteriaBuilder.lower(root.get("name")),
          "%" + name.toLowerCase() + "%");
      }

      return criteriaBuilder.conjunction();
    };
  }

  public static Specification<BasicMovie> yearEqualsTo(Integer year) {
    return (root, query, criteriaBuilder) -> {
      if (year != null && year > 0) {
        return criteriaBuilder.equal(root.get("date"), year);
      }

      return criteriaBuilder.conjunction();
    };
  }

  public static Specification<BasicMovie> yearGreatThanOrEqual(Integer year){
    return (root, query, criteriaBuilder) -> {
      if(year != null && year > 0){
        return criteriaBuilder.greaterThanOrEqualTo(root.get("date"), year);
      }

      return criteriaBuilder.conjunction();
    };
  }

  public static Specification<BasicMovie> yearLowerThanOrEqual(Integer year){
    return (root, query, criteriaBuilder) -> {
      if(year != null && year > 0){
        return criteriaBuilder.lessThanOrEqualTo(root.get("date"), year);
      }

      return criteriaBuilder.conjunction();
    };
  }

  public static Specification<BasicMovie> yearBetween(Integer year_min,
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

  public static Specification<BasicMovie> ratingGreaterThanOrEqual(Float rating){
    return (root, query, criteriaBuilder) -> {
      if(rating != null && rating >= 0){
        return criteriaBuilder.greaterThanOrEqualTo(root.get("rating"), rating);
      }

      return criteriaBuilder.conjunction();
    };
  }

  public static Specification<BasicMovie> ratingLowerThanOrEqual(Float rating){
    return (root, query, criteriaBuilder) -> {
      if(rating != null && rating >= 0){
        return criteriaBuilder.lessThanOrEqualTo(root.get("rating"), rating);
      }

      return criteriaBuilder.conjunction();
    };
  }

  public static Specification<BasicMovie> ratingBetween(Float rating_min,
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

  public static Specification<BasicMovie> durationGreaterThanOrEqual(Integer duration){
    return (root, query, criteriaBuilder) -> {
      if(duration != null && duration >= 0){
        return criteriaBuilder.greaterThanOrEqualTo(root.get("minute"),
          duration);
      }

      return criteriaBuilder.conjunction();
    };
  }

  public static Specification<BasicMovie> durationLowerThanOrEqual(Integer duration){
    return (root, query, criteriaBuilder) -> {
      if(duration != null && duration >= 0){
        return criteriaBuilder.lessThanOrEqualTo(root.get("minute"), duration);
      }

      return criteriaBuilder.conjunction();
    };
  }

  public static Specification<BasicMovie> durationBetween(Integer duration_min,
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

  public static Specification<BasicMovie> hasGenre(List<String> genres){
    return (root, query, criteriaBuilder) -> {
      if(genres != null && !genres.isEmpty()){
        Join<BasicMovie, Genre> genre_join = root.join("genres", JoinType.INNER);
        return genre_join.get("genre_name").in(genres);
      }

      return criteriaBuilder.conjunction();
    };
  }

  public static Specification<BasicMovie> hasPoster(Path<?> movie_id){
    return (root, query, criteriaBuilder) -> {
      if(movie_id != null){
        Join<BasicMovie, Poster> poster_join = root.join("poster", JoinType.INNER);
        return criteriaBuilder.equal(poster_join.get("id"), movie_id);
      }

      return criteriaBuilder.conjunction();
    };
  }

  public static Specification<BasicMovie> hasActor(Integer actor_id) {
    return (root, query, cb) -> {
      if (actor_id == null) return cb.conjunction();
      Join<BasicMovie, MoviesHaveActors> actors = root.join("actors");
      Join<MoviesHaveActors, Actor> actor = actors.join("actor");
      return cb.equal(actor.get("id"), actor_id);
    };
  }

  public static Specification<BasicMovie> hasActorName(String actor_name) {
    return (root, query, criteriaBuilder) -> {
      if(actor_name != null && actor_name.isEmpty() == false){
        Join<BasicMovie, MoviesHaveActors> actors = root.join("actors");
        Join<MoviesHaveActors, Actor> actor = actors.join("actor");
        return criteriaBuilder.like(criteriaBuilder.lower(actor.get("name")),
          "%" + actor_name.toLowerCase() + "%");
      }

      return criteriaBuilder.conjunction();
    };
  }

}
