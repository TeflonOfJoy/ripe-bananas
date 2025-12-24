package com.ripe_bananas.banana_bean.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "country")
@ToString(exclude = "movies")
@EqualsAndHashCode(exclude = "movies")
public class Country {
  @Id
  @Column(name = "id")
  @JsonIgnore
  private Integer id;

  @Column(name = "name")
  @JsonValue
  private String country_name;

  @JsonIgnore
  @ManyToMany(mappedBy = "countries")
  private Set<Movie> movies;
}
