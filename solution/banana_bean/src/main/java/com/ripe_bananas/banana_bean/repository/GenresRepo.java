package com.ripe_bananas.banana_bean.repository;

import com.ripe_bananas.banana_bean.entity.Genre;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GenresRepo extends JpaRepository<Genre, Integer>{

  @Query(value = "SELECT genre_id, genre FROM genres", nativeQuery = true)
  List<Genre> findGenreList();

}
