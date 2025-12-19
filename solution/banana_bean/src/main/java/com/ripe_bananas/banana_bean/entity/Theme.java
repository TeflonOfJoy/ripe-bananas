package com.ripe_bananas.banana_bean.entity;

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
@Table(name = "themes")
public class Theme {
  @Id
  @Column(name = "id")
  private Integer id;

  @Column(name = "theme")
  private String Theme;
}
