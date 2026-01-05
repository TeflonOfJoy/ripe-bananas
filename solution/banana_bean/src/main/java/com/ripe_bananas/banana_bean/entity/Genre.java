package com.ripe_bananas.banana_bean.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonUnwrapped;
import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
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
  @JsonIgnore
  private Integer genre_id;

  @Column(name = "genre", length = 50)
  @JsonValue
  private String genre_name;

  @JsonIgnore
  @ManyToMany(mappedBy = "genres")
  private Set<Movie> movies;
}
