package com.ripe_bananas.banana_bean.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "releases")
public class Releases {
  @Id
  @Column(name = "id")
  private Integer id;

  @ManyToOne
  private Country country;

  @Column(name = "date")
  private Date date;

  @Column(name = "type")
  private String type;

  @Column(name = "rating")
  private String rating;
}
