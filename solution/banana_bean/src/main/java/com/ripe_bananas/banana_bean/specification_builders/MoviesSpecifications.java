package com.ripe_bananas.banana_bean.specification_builders;

import com.ripe_bananas.banana_bean.entity.Movie;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class MoviesSpecifications {

    private static void addNameFilter(String name,
                               List<Predicate> predicates,
                               CriteriaBuilder cb,
                               Root<Movie> root) {
        if (name != null && !name.isEmpty()) {
            predicates.add(cb.like(cb.lower(root.get("name")),
                            "%" + name.toLowerCase() + "%"));
        }
    }

    private static void addYearFilter(Integer year,
                               List<Predicate> predicates,
                               CriteriaBuilder cb,
                               Root<Movie> root) {
        if (year != null) {
            predicates.add(cb.equal(root.get("date"), year));
        }
    }

    private static void addRatingFilter(Float min_rating,
                                 Float max_rating,
                                 List<Predicate> predicates,
                                 CriteriaBuilder cb,
                                 Root<Movie> root) {
        if (min_rating != null) {
            predicates.add(cb.greaterThanOrEqualTo(root.get("rating"),
                    min_rating));
        }

        if (max_rating != null) {
            predicates.add(cb.lessThanOrEqualTo(root.get("rating"),
                    max_rating));
        }
    }

    private static void addDurationFilter(Integer min_duration,
                                   Integer max_duration,
                                   List<Predicate> predicates,
                                   CriteriaBuilder cb,
                                   Root<Movie> root) {
        if (min_duration != null) {
            predicates.add(cb.greaterThanOrEqualTo(root.get("minute"),
                    min_duration));
        }

        if (max_duration != null) {
            predicates.add(cb.lessThanOrEqualTo(root.get("minute"),
                    max_duration));
        }
    }

    public static Specification<Movie> withFilters(
            String name,
            Integer year,
            Float min_rating,
            Float max_rating,
            Integer min_duration,
            Integer max_duration
    ){
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            addNameFilter(name, predicates, criteriaBuilder, root);
            addYearFilter(year, predicates, criteriaBuilder, root);
            addDurationFilter(min_duration, max_duration, predicates,
                    criteriaBuilder, root);
            addRatingFilter(min_rating, max_rating, predicates,
                    criteriaBuilder, root);

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
