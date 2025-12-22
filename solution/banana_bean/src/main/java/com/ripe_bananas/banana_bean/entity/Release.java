package com.ripe_bananas.banana_bean.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonUnwrapped;
import jakarta.persistence.*;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "releases")
@ToString(exclude = "movie")
@EqualsAndHashCode(exclude = "movie")
public class Release {
  @EmbeddedId
  @JsonUnwrapped
  private ReleaseId id;

  @Column(name = "rating", length = 999)
  private String rating;

  @ManyToOne
  @JsonIgnore
  @MapsId("id")
  @JoinColumn(name = "id")
  private Movie movie;

  @ManyToOne
  @MapsId("country")
  @JoinColumn(name = "country")
  @JsonUnwrapped
  private Country country;
}
