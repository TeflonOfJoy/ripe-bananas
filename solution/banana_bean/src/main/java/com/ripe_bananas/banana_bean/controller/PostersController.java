package com.ripe_bananas.banana_bean.controller;

import com.ripe_bananas.banana_bean.entity.Poster;
import com.ripe_bananas.banana_bean.service.PostersService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/banana_bean_api")
@RequiredArgsConstructor
@Validated
@Slf4j
public class PostersController {

    private final PostersService posters_service;

    @Tag(name = "GET", description = "Get methods")
    @Operation(summary = "Get a movie poster",
            description = "request a movie poster providing a valid movie id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    content = {@Content(mediaType = "application/json",
                    schema = @Schema(implementation = Poster.class))}),
            @ApiResponse(responseCode = "404", description = "Poster not " +
                    "found", content = @Content)
    })
    @GetMapping("/get_movie_poster")
    public ResponseEntity<Poster> getMoviePoster(
            @Parameter(description = "id of the movie in the database")
            @RequestParam(value = "id") Integer id){
        Poster response = posters_service.findById(id);

        if(response != null){
            return ResponseEntity.ok().body(response);
        }

        return ResponseEntity.notFound().build();
    }

}
