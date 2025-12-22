package com.ripe_bananas.banana_bean.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonUnwrapped;
import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.persistence.*;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "themes")
@ToString(exclude = "movie")
@EqualsAndHashCode(exclude = "movie")
public class Theme {
  @EmbeddedId
  @JsonValue
  private ThemeId id;

  @JsonIgnore
  @ManyToOne
  @MapsId("id")
  @JoinColumn(name = "id")
  private Movie movie;
}
