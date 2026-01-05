package com.ripe_bananas.banana_bean.controller;

import com.ripe_bananas.banana_bean.dto.GenreDTO;
import com.ripe_bananas.banana_bean.entity.BasicMovie;
import com.ripe_bananas.banana_bean.service.GenresService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/genres")
@RequiredArgsConstructor
@Validated
@Slf4j
public class GenresController {

  private final GenresService genres_service;

  @Tag(name = "Genres", description = "Genres related endpoints")
  @Operation(summary = "Retrieve the list of genres from the Database")
  @ApiResponses(value = {
    @ApiResponse(responseCode = "200", content = {@Content(mediaType
      = "application/json",
      schema = @Schema(implementation = GenreDTO.class))}),
    @ApiResponse(responseCode = "404", description = "List of Genres not found",
      content = @Content)
  })
  @GetMapping("/get_genres_list")
  public ResponseEntity<List<GenreDTO>> getGenresList(){
    List<GenreDTO> response = genres_service.findGenresList();

    if (response != null && response.isEmpty() == false){
      return ResponseEntity.ok().body(response);
    }

    return ResponseEntity.notFound().build();
  }
}
