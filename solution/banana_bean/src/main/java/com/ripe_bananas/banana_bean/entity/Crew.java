package com.ripe_bananas.banana_bean.entity;

import jakarta.annotation.Nullable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "crew")
public class Crew {
  @Id
  @Column(name = "id")
  private Integer id;

  @Nullable
  @Column(name = "role")
  private String role;

  @Column(name = "name")
  private String name;
}
