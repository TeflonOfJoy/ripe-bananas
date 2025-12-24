package com.ripe_bananas.banana_bean.repository;

import com.ripe_bananas.banana_bean.entity.Actor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ActorsRepo extends JpaRepository<Actor, Integer> {

  @Query("SELECT a FROM Actor a WHERE LOWER(a.name) LIKE" +
    " LOWER(CONCAT('%', :actor_name, '%'))")
  Page<Actor> findByName(@Param("actor_name") String actor_name, Pageable page);

}
