package com.ripe_bananas.banana_bean.entity;

import java.util.Set;

public interface BasicMovieProjection {
  Integer getId();
  String getName();
  Integer getDate();
  String getTagline();
  String getDescription();
  Integer getMinute();
  Float getRating();
  Set<Genre> getGenres();
  Poster getPoster();
}
