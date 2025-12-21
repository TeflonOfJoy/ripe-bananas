package com.ripe_bananas.banana_bean.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonUnwrapped;
import jakarta.persistence.*;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "languages")
@ToString(exclude = "movie")
@EqualsAndHashCode(exclude = "movie")
public class Language {
  @EmbeddedId
  @JsonUnwrapped
  private LanguageId id;

  @JsonIgnore
  @ManyToOne
  @MapsId("id")
  @JoinColumn(name = "id")
  private Movie movie;
}
