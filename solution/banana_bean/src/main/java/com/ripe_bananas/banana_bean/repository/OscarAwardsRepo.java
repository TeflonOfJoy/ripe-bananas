package com.ripe_bananas.banana_bean.repository;

import com.ripe_bananas.banana_bean.entity.OscarAward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface OscarAwardsRepo extends JpaRepository<OscarAward, Integer>,
  JpaSpecificationExecutor<OscarAward> {
}
