package com.ripe_bananas.banana_bean.controller;

import com.ripe_bananas.banana_bean.entity.OscarAward;
import com.ripe_bananas.banana_bean.service.OscarAwardsService;
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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/oscar_awards")
@RequiredArgsConstructor
@Validated
@Slf4j
public class OscarAwardsController {

  private final OscarAwardsService oscars_service;

  @Tag(name = "Oscar Awards", description = "Oscar Awards related endpoints")
  @Operation(summary = "Extract a Page of Oscar Awards matching specific " +
    "search",
    description = "Select a Page of Oscar Awards that corresponds to a " +
      "certain search, blank fields be omitted by the search")
  @ApiResponses(value = {
    @ApiResponse(responseCode = "200", content = {@Content(mediaType
      = "application/json",
      schema = @Schema(implementation = OscarAward.class))}),
    @ApiResponse(responseCode = "404", description = "Oscar Awards not " +
      "found", content = @Content)
  })
  @GetMapping("/get_oscar_awards")
  public ResponseEntity<Page<OscarAward>> getOscarAwards(
    @Parameter(description = "Name of the awarded actor or crew member")
    @RequestParam(required = false) String name,
    @Parameter(description = "Name of the awarded film")
    @RequestParam(required = false) String film_name,
    @Parameter(description = "Oscar Award category")
    @RequestParam(required = false) String category,
    @Parameter(description = "Year of movie release, minimum")
    @RequestParam(required = false) Integer min_year_film,
    @Parameter(description = "Year of movie release, maximum, leave blank if " +
      "not needed")
    @RequestParam(required = false) Integer max_year_film,
    @Parameter(description = "Year of ceremony, minimum")
    @RequestParam(required = false) Integer min_year_ceremony,
    @Parameter(description = "Year of ceremony, maximum, leave blank if not " +
      "needed")
    @RequestParam(required = false) Integer max_year_ceremony,
    @Parameter(description = "Minimum ceremony to search")
    @RequestParam(required = false) Integer min_ceremony,
    @Parameter(description = "Maximum ceremony to search, leave blank if not " +
      "needed")
    @RequestParam(required = false) Integer max_ceremony,
    @Parameter(description = "Winner status, true or false")
    @RequestParam(required = false) Boolean winner,
    @Parameter(description = "Sort field for the query")
    @RequestParam(required = false) String sort_by,
    @Parameter(description = "Sort direction, case insensitive")
    @RequestParam(required = false) String sort_direction,
    @Parameter(description = "Number of page to retrieve, if > 0 " +
      "retieve the next page of the same search")
    @RequestParam(value = "page_num", defaultValue = "0") int page_num,
    @Parameter(description = "Number of entries per page")
    @RequestParam(value = "page_sz", defaultValue = "25") int page_size
  ) {
    Page<OscarAward> response = oscars_service
      .findOscarAwardsWithFilers(name, film_name, category, min_year_film,
        max_year_film, min_year_ceremony, max_year_ceremony, min_ceremony,
        max_ceremony, winner, sort_by, sort_direction, page_num, page_size);

    if (response == null || response.isEmpty() == true) {
      return ResponseEntity.notFound().build();
    }

    return ResponseEntity.ok().body(response);
  }

}
