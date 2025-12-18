package com.ripe_bananas.banana_bean.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Data
@ToString(exclude = "movies")
@EqualsAndHashCode(exclude = "movies")
@Entity
@Table(name = "genres")
public class Genre {
  @Id
  @Column(name = "genre_id")
  private Integer genre_id;

  @Column(name = "genre", length = 50)
  private String genre_name;

  @JsonIgnore
  @ManyToMany(mappedBy = "genres")
  private Set<Movie> movies;
}
