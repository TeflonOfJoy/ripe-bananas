package com.ripe_bananas.banana_bean.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonUnwrapped;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "crew")
@ToString(exclude = "movie")
@EqualsAndHashCode(exclude = "movie")
public class Crew {
  @EmbeddedId
  @JsonUnwrapped
  private CrewId id;

  @JsonIgnore
  @ManyToOne
  @MapsId("id")
  @JoinColumn(name = "id")
  private Movie movie;
}
