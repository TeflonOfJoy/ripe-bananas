package com.ripe_bananas.banana_bean.service;

import com.ripe_bananas.banana_bean.entity.Poster;
import com.ripe_bananas.banana_bean.repository.PostersRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class PostersService {

    private final PostersRepo posters_repo;

    public Poster findById(Integer id) {
        return posters_repo.findById(id).orElse(null);
    }

}
