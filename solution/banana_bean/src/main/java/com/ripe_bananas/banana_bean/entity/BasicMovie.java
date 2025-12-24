package com.ripe_bananas.banana_bean.entity;

import io.micrometer.common.lang.Nullable;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Data
@ToString(exclude = "genres")
@EqualsAndHashCode(exclude = "genres")
@Entity
@Table(name = "movies")
public class BasicMovie {
  @Id
  @Column(name = "id")
  private Integer id;

  @Column(name = "name", nullable = false)
  private String name;

  @Nullable
  @Column(name = "date")
  private Integer date;

  @Nullable
  @Column(name = "tagline")
  private String tagline;

  @Nullable
  @Column(name = "description")
  private String description;

  @Nullable
  @Column(name = "minute")
  private Integer minute;

  @Nullable
  @Column(name = "rating")
  private Float rating;

  @ManyToMany
  @JoinTable(
    name = "movie_has_genres",
    joinColumns = @JoinColumn(name = "movie_id"),
    inverseJoinColumns = @JoinColumn(name = "genre_id")
  )
  private Set<Genre> genres;

  @OneToOne
  @JoinTable(
    name = "posters",
    joinColumns = @JoinColumn(name = "id"),
    inverseJoinColumns = @JoinColumn(name = "id")
  )
  private Poster poster;
}
