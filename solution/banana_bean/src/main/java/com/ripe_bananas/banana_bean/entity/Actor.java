package com.ripe_bananas.banana_bean.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "actors")
@ToString(exclude = "movie_roles")
@EqualsAndHashCode(exclude = "movie_roles")
@JsonIgnoreProperties({"hibernate_lazy_initializer", "handler"})
public class Actor {
  @Id
  @Column(name = "id")
  private Integer id;

  @Column(name = "name")
  private String name;

  @JsonIgnore
  @OneToMany(mappedBy = "actor")
  private Set<MoviesHaveActors> movie_roles;
}
