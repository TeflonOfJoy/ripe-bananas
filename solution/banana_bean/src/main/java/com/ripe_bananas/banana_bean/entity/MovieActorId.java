package com.ripe_bananas.banana_bean.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@NoArgsConstructor
@AllArgsConstructor
@Data
public class MovieActorId implements Serializable {
  @Column(name = "movie_id")
  private Integer movie_id;

  @Column(name = "actor_id")
  private Integer actor_id;

  @Column(name = "role")
  private String role;
}
