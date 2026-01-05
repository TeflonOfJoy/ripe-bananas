package com.ripe_bananas.banana_bean.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonUnwrapped;
import jakarta.persistence.*;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "movies_have_actors")
@ToString(exclude = {"movie", "actor"})
@EqualsAndHashCode(exclude = {"movie", "actor"})
public class MoviesHaveActors {
  @EmbeddedId
  @JsonIgnore
  private MovieActorId id;

  @ManyToOne(fetch = FetchType.LAZY)
  @MapsId("movie_id")
  @JoinColumn(name = "movie_id")
  @JsonIgnore
  private Movie movie;

  @ManyToOne(fetch = FetchType.LAZY)
  @MapsId("actor_id")
  @JoinColumn(name = "actor_id")
  @JsonUnwrapped
  private Actor actor;

  @Column(name = "role", nullable = false, length = 999, insertable = false, updatable = false)
  private String role;
}
