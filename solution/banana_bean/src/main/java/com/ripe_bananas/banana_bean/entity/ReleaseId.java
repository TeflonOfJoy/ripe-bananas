package com.ripe_bananas.banana_bean.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;

@Embeddable
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ReleaseId implements Serializable {
  @Column(name = "id")
  @JsonIgnore
  private Integer id;

  @Column(name = "country")
  @JsonIgnore
  private Integer country;

  @Column(name = "date")
  private Date date;

  @Column(name = "type", length = 999)
  private String type;
}
