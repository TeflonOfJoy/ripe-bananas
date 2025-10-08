package com.ripe_bananas.banana_bean.specification_builders;

import com.ripe_bananas.banana_bean.entity.Movie;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class MoviesSpecifications {

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

            // Filter by name (case-insensitive, partial match)
            if (name != null && !name.isEmpty()) {
                predicates.add(
                        criteriaBuilder.like(
                                criteriaBuilder.lower(root.get("name")),
                                "%" + name.toLowerCase() + "%"
                        )
                );
            }

            // Filter by year
            if (year != null) {
                predicates.add(
                        criteriaBuilder.equal(root.get("date"), year)
                );
            }

            // Filter by minimum rating
            if (min_rating != null) {
                predicates.add(
                        criteriaBuilder.greaterThanOrEqualTo(root.get("rating"),
                                min_rating)
                );
            }

            // Filter by maximum rating
            if (max_rating != null) {
                predicates.add(
                        criteriaBuilder.lessThanOrEqualTo(root.get("rating"),
                                max_rating)
                );
            }

            // Filter by minimum duration
            if (min_duration != null) {
                predicates.add(
                        criteriaBuilder.greaterThanOrEqualTo(root.get("minute"),
                                min_duration)
                );
            }

            // Filter by maximum duration
            if (max_duration != null) {
                predicates.add(
                        criteriaBuilder.lessThanOrEqualTo(root.get("minute"),
                                max_duration)
                );
            }

            // Combine all predicates with AND
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
