package com.ripe_bananas.banana_bean.service;

import com.ripe_bananas.banana_bean.entity.Movie;
import com.ripe_bananas.banana_bean.repository.MoviesRepo;
import com.ripe_bananas.banana_bean.specification_builders.MoviesSpecifications;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Tuple;
import jakarta.persistence.criteria.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class MoviesService {

  private final EntityManager entity_manager;
  private final MoviesRepo movies_repo;

  public List<Map<String, Object>> findMoviesWithFields(List<String> fields,
                                                        String name,
                                                        List<String> genres,
                                                        Float min_rating,
                                                        Float max_rating,
                                                        Integer min_year,
                                                        Integer max_year,
                                                        Integer min_duration,
                                                        Integer max_duration) {
    if (fields == null || fields.isEmpty() == true) {
      throw new IllegalArgumentException("You must specify at least one field");
    }

    CriteriaBuilder cb = entity_manager.getCriteriaBuilder();
    CriteriaQuery<Tuple> query = cb.createTupleQuery();
    Root<Movie> root = query.from(Movie.class);

    List<Selection<?>> selections = new ArrayList<>();
    for (String field : fields) {
      selections.add(root.get(field.toLowerCase()).alias(field.toLowerCase()));
    }
    selections.add(root.get("poster"));
    query.multiselect(selections);

    List<Specification<Movie>> specs = new ArrayList<>();

    specs.add(MoviesSpecifications.nameLikeTo(name));

    if ((genres != null) && (genres.isEmpty() == false)) {
      for (String genre : genres) {
        specs.add(MoviesSpecifications.hasGenre(genre));
      }
    }

    specs.add(MoviesSpecifications.ratingGreaterThanOrEqual(min_rating));
    specs.add(MoviesSpecifications.ratingLowerThanOrEqual(max_rating));
    specs.add(MoviesSpecifications.yearGreatThanOrEqual(min_year));
    specs.add(MoviesSpecifications.yearLowerThanOrEqual(max_year));
    specs.add(MoviesSpecifications.durationGreaterThanOrEqual(min_duration));
    specs.add(MoviesSpecifications.durationLowerThanOrEqual(max_duration));

    Specification<Movie> spec = Specification.allOf(specs);

    //return movies_repo.findAll(spec);

    Predicate predicate = spec.toPredicate(root, query, cb);
    if (predicate != null) {
      query.where(predicate);
    }

    List<Tuple> tuples = entity_manager.createQuery(query).getResultList();

    Map<Integer, Map<String, Object>> movie_map = new LinkedHashMap<>();

    for(Tuple tuple : tuples){
      Integer movie_id = tuple.get("id", Integer.class);
      Map<String, Object> movie_data = new HashMap<>();
      movie_data.put("id", movie_id);
      for(String field : fields){
        if(field.equalsIgnoreCase("id") == false){
          Object value = tuple.get(field.toLowerCase());
          movie_data.put(field.toLowerCase(), value);
        }
      }

      if(genres != null && genres.isEmpty() == false){
        movie_data.put("genres", new ArrayList<Map<String, Object>>());
      }

      movie_map.put(movie_id, movie_data);
    }

    return new ArrayList<>(movie_map.values());
  }

  public Movie findMovieDetailsById(Integer movie_id){
    if(movie_id == null || movie_id <= 0){
      return null;
    }

    Movie response = movies_repo.findMovieDetailById(movie_id);

    return response;
  }

}
