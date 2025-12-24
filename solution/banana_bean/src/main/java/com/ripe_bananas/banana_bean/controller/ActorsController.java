package com.ripe_bananas.banana_bean.controller;

import com.ripe_bananas.banana_bean.entity.Actor;
import com.ripe_bananas.banana_bean.service.ActorsService;
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

@RestController
@RequestMapping("/banana_bean/api")
@RequiredArgsConstructor
@Validated
@Slf4j
public class ActorsController {

  public final ActorsService actors_service;

  @Tag(name = "GET", description = "GET methods")
  @Operation(summary = "Extract Actors which name match the given String " +
    "parameter")
  @ApiResponses(value = {
    @ApiResponse(responseCode = "200", content = {@Content(mediaType
      = "application/json",
      schema = @Schema(implementation = Actor.class))}),
    @ApiResponse(responseCode = "404", description = "Actor/s not found",
      content = @Content)
  })
  @GetMapping("/get_actors/")
  public ResponseEntity<Page<Actor>> getActors(
    @Parameter(description = "Name of the actor to seach")
    @RequestParam(required = false) String name,
    @Parameter(description = "Sort field for the query")
    @RequestParam(required = false) String sort_by,
    @Parameter(description = "Number of page to retrieve, if > 0 " +
      "retieve the next page of the same search")
    @RequestParam(value = "page_num", defaultValue = "0") int page_num,
    @Parameter(description = "Number of entries per page")
    @RequestParam(value = "page_sz", defaultValue = "25") int page_size
    ){
    Page<Actor> response = actors_service.searchActorByName(name, sort_by, page_num,
      page_size);

    if (response == null || response.isEmpty() == true){
      return ResponseEntity.notFound().build();
    }

    return ResponseEntity.ok().body(response);
  }

}
