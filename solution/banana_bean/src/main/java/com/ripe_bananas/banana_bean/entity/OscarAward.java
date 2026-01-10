package com.ripe_bananas.banana_bean.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Table(name = "oscar_awards")
public class OscarAward {
  @Id
  @Column(name = "id")
  private Integer id;

  @Column(name = "year_film")
  private Integer year_film;

  @Column(name = "year_ceremony")
  private Integer year_ceremony;

  @Column(name = "ceremony")
  private Integer ceremony;

  @Column(name = "category")
  private String category;

  @Column(name = "name")
  private String name;

  @Column(name = "film")
  private String film;

  @Column(name = "winner")
  private Boolean winner;
}
