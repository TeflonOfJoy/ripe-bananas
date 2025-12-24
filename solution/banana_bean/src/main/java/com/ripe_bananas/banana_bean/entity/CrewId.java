package com.ripe_bananas.banana_bean.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CrewId implements Serializable {

  @Column(name = "id")
  @JsonIgnore
  private Integer id;

  @Column(name = "role", length = 999)
  private String role;

  @Column(name = "name", length = 999)
  private String name;
}
