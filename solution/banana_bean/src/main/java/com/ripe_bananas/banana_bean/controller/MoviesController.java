package com.ripe_bananas.banana_bean.controller;

import com.ripe_bananas.banana_bean.entity.Movie;
import com.ripe_bananas.banana_bean.service.MoviesGenresService;
import com.ripe_bananas.banana_bean.service.MoviesService;
import com.ripe_bananas.banana_bean.specification_builders.MoviesSpecifications;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.Tuple;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/banana_bean_api")
@RequiredArgsConstructor
@Validated
@Slf4j
public class MoviesController {

  private final MoviesService movies_service;
  private final MoviesGenresService movies_genres_service;

  @Tag(name = "GET", description = "GET methods")
  @Operation(summary = "Extract a subpage of movies",
    description = "Select 1000 movies from the db that meet the request " +
      "parameters cache the result and present a subpage of page_sz " +
      "entries as a response")
  @ApiResponses(value = {
    @ApiResponse(responseCode = "200", content = {@Content(mediaType
      = "application/json",
      schema = @Schema(implementation = Movie.class))}),
    @ApiResponse(responseCode = "404", description = "Movies not " +
      "found", content = @Content)
  })
  @GetMapping("/get_movies")
  public ResponseEntity<List<Map<String, Object>>> getMovies(
    @Parameter(description = "list of fields to select")
    @RequestParam(value = "fields") List<String> fields,
    @Parameter(description = "Name of the movie")
    @RequestParam(required = false) String movie_name,
    @Parameter(description = "list of genres to search the movie with")
    @RequestParam(required = false) List<String> genres,
    @Parameter(description = "Year of release")
    @RequestParam(required = false) Integer year,
    @Parameter(description = "Minimum rating to search")
    @RequestParam(required = false) Float min_rating,
    @Parameter(description = "Maximum rating to search")
    @RequestParam(required = false) Float max_rating,
    @Parameter(description = "Minimum duration to search")
    @RequestParam(required = false) Integer min_duration,
    @Parameter(description = "Maximum rating to search")
    @RequestParam(required = false) Integer max_duration,
    @Parameter(description = "Sort field for the query")
    @RequestParam(required = false) String sort_by,
    @Parameter(description = "Number of page to retrieve, if > 0 " +
      "retieve the next page of the same search")
    @RequestParam(value = "page_num", defaultValue = "0") int page_num,
    @Parameter(description = "Number of entries per page")
    @RequestParam(value = "page_sz", defaultValue = "25") int page_size
  ) {
    List<Map<String, Object>> response = movies_service.findMoviesWithFields(fields,
      movie_name, genres, min_rating, max_rating, year, null, min_duration,
      max_duration);

    if((response != null) && (response.isEmpty() == false)){
      return ResponseEntity.ok().body(response);
    }

    return ResponseEntity.notFound().build();
  }

  @GetMapping("/get_movie_details/{id}")
  public ResponseEntity<Movie> getMoviesBySpecifiedGenre(Integer id) {
    Movie response = movies_service.findMovieDetailsById(id);

    if(response == null){
      return ResponseEntity.notFound().build();
    }

    return ResponseEntity.ok().body(response);
  }
}
