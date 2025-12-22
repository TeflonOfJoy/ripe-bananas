package com.ripe_bananas.banana_bean.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@NoArgsConstructor
@AllArgsConstructor
@Data
public class LanguageId implements Serializable {
  @Column(name = "id")
  @JsonIgnore
  private Integer id;

  @Column(name = "type", length = 999)
  private String type;

  @Column(name = "language", length = 999)
  private String language;
}
