package com.ripe_bananas.banana_bean.entity;

import io.micrometer.common.lang.Nullable;
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
@Table(name = "movies")
public class Movie {
    @Id
    private Integer id;
    @Nullable
    private String name;
    @Nullable
    private Integer date;
    @Nullable
    private String tagline;
    @Nullable
    private String description;
    @Nullable
    private Integer minute;
    @Nullable
    private Float rating;
}
