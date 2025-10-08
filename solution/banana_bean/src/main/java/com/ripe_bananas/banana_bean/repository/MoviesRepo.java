package com.ripe_bananas.banana_bean.repository;

import com.ripe_bananas.banana_bean.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface MoviesRepo extends JpaRepository<Movie,  Integer>,
                                    JpaSpecificationExecutor<Movie> {

}
