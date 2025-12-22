package com.ripe_bananas.banana_bean.entity;

import com.fasterxml.jackson.annotation.JsonView;
import io.micrometer.common.lang.Nullable;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Data
@ToString(exclude = {"genres", "actors", "crew", "themes", "studios",
  "languages", "countries", "releases"})
@EqualsAndHashCode(exclude = {"genres", "actors", "crew", "themes", "studios"
  , "languages", "countries", "releases"})
@Entity
@Table(name = "movies")
public class Movie {
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

  @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true)
  private Set<MoviesHaveActors> actors;

  @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true)
  private Set<Crew> crew;

  @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true)
  private Set<Theme> themes;

  @ManyToMany
  @JoinTable(
    name = "movie_have_studios",
    joinColumns = @JoinColumn(name = "movie_id"),
    inverseJoinColumns = @JoinColumn(name = "studio_id")
  )
  private Set<Studio> studios;

  @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true)
  private Set<Language> languages;

  @ManyToMany
  @JoinTable(
    name = "movie_have_countries",
    joinColumns = @JoinColumn(name = "movie_id"),
    inverseJoinColumns = @JoinColumn(name = "country_id")
  )
  private Set<Country> countries;

  @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true)
  private Set<Release> releases;
}
