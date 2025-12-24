package com.ripe_bananas.banana_bean.service;

import com.ripe_bananas.banana_bean.dto.GenreDTO;
import com.ripe_bananas.banana_bean.entity.Genre;
import com.ripe_bananas.banana_bean.repository.GenresRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Slf4j
public class GenresService {

  private final GenresRepo genres_repo;

  private List<GenreDTO> convertGenre(Stream<Genre> genres){
    List<GenreDTO> list_of_genres = genres.map(
      g -> new GenreDTO(
        g.getGenre_id(),
        g.getGenre_name()
      )
    ).collect(Collectors.toList());

    return list_of_genres;
  }

  public List<GenreDTO> findGenresList(){
    List<Genre> res = genres_repo.findGenreList();

    return convertGenre(res.stream());
  }

}
