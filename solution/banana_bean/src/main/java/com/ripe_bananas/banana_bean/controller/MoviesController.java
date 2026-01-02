package com.ripe_bananas.banana_bean.controller;

import com.ripe_bananas.banana_bean.entity.BasicMovie;
import com.ripe_bananas.banana_bean.entity.BasicMovieProjection;
import com.ripe_bananas.banana_bean.entity.Movie;
import com.ripe_bananas.banana_bean.service.MoviesService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
@Validated
@Slf4j
public class MoviesController {

  private final MoviesService movies_service;

  @Tag(name = "Movies", description = "Movies related endpoints")
  @Operation(summary = "Extract a Page of movies matching specific search",
    description = "Select a Page of movies that corresponds to a certain " +
      "search, blank fields be omitted by the search")
  @ApiResponses(value = {
    @ApiResponse(responseCode = "200", content = {@Content(mediaType
      = "application/json",
      schema = @Schema(implementation = BasicMovie.class))}),
    @ApiResponse(responseCode = "404", description = "Movies not " +
      "found", content = @Content)
  })
  @GetMapping("/get_movies")
  public ResponseEntity<Page<BasicMovie>> getMovies(
    @Parameter(description = "Name of the movie")
    @RequestParam(required = false) String movie_name,
    @Parameter(description = "list of genres to search the movie with")
    @RequestParam(required = false) List<String> genres,
    @Parameter(description = "Year of release, minimum")
    @RequestParam(required = false) Integer min_year,
    @Parameter(description = "Year of release, maximum, leave blank if not " +
      "needed")
    @RequestParam(required = false) Integer max_year,
    @Parameter(description = "Minimum rating to search")
    @RequestParam(required = false) Float min_rating,
    @Parameter(description = "Maximum rating to search, leave blank if not " +
      "needed")
    @RequestParam(required = false) Float max_rating,
    @Parameter(description = "Minimum duration to search")
    @RequestParam(required = false) Integer min_duration,
    @Parameter(description = "Maximum rating to search, leave blank if not " +
      "needed")
    @RequestParam(required = false) Integer max_duration,
    @Parameter(description = "Sort field for the query")
    @RequestParam(required = false) String sort_by,
    @Parameter(description = "Number of page to retrieve, if > 0 " +
      "retieve the next page of the same search")
    @RequestParam(value = "page_num", defaultValue = "0") int page_num,
    @Parameter(description = "Number of entries per page")
    @RequestParam(value = "page_sz", defaultValue = "25") int page_size
  ) {
    Page<BasicMovie> response =
      movies_service.findMoviesWithFilters(movie_name, genres, min_rating,
        max_rating, min_year, max_year, min_duration, max_duration, sort_by,
        page_num, page_size);

    if (response == null || response.isEmpty() == true){
      return ResponseEntity.notFound().build();
    }

    return ResponseEntity.ok().body(response);
  }

  @Tag(name = "Movies", description = "Movies related endpoints")
  @Operation(summary = "Given a Movie Id extract all the informations " +
    "regarding that Movie")
  @ApiResponses(value = {
    @ApiResponse(responseCode = "200", content = {@Content(mediaType
      = "application/json",
      schema = @Schema(implementation = Movie.class))}),
    @ApiResponse(responseCode = "404", description = "Movie not found",
      content = @Content)
  })
  @GetMapping("/get_movie_details/{id}")
  public ResponseEntity<Movie> getMovieDetails(
    @Parameter(description = "Id of the movie you want to search")
    @PathVariable Integer id) {
    Movie response = movies_service.findMovieDetailsById(id);

    if (response == null) {
      return ResponseEntity.notFound().build();
    }

    return ResponseEntity.ok().body(response);
  }

  @Tag(name = "Movies", description = "Movies related endpoints")
  @Operation(summary = "Given an Actor Id extract all the movies in which " +
    "that actor appears")
  @ApiResponses(value = {
    @ApiResponse(responseCode = "200", content = {@Content(mediaType
      = "application/json",
      schema = @Schema(implementation = BasicMovieProjection.class))}),
    @ApiResponse(responseCode = "404", description = "Movies not " +
      "found", content = @Content)
  })
  @GetMapping("/get_movies_with_actor")
  public ResponseEntity<Page<BasicMovieProjection>> getMoviesWithActor(
    @Parameter(description = "Id of the actor")
    @RequestParam(value = "actor_id") Integer actor_id,
    @Parameter(description = "Number of page to retrieve, if > 0 " +
      "retrieve the next page of the same search")
    @RequestParam(value = "page_num", defaultValue = "0") int page_num,
    @Parameter(description = "Number of entries per page")
    @RequestParam(value = "page_sz", defaultValue = "25") int page_sz
  ){
    Page<BasicMovieProjection> response =
      movies_service.findMoviesWithActor(actor_id, page_num, page_sz);

    if (response == null || response.isEmpty() == true){
      return ResponseEntity.notFound().build();
    }

    return ResponseEntity.ok().body(response);
  }
}
