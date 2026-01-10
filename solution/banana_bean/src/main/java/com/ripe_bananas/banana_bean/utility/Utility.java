package com.ripe_bananas.banana_bean.utility;

import org.springframework.data.domain.Sort;

public class Utility {

  public static Sort buildSortBy(String sort_by, String sort_direction) {
    Sort sort;
    if ((sort_by == null || sort_by.isEmpty() == true) ||
      (sort_direction == null || sort_direction.isEmpty() == true)) {
      return null;
    } else {
      if (sort_direction.equalsIgnoreCase("desc") == true) {
        sort = Sort.by(Sort.Direction.DESC, sort_by);
      } else {
        sort = Sort.by(Sort.Direction.ASC, sort_by);
      }
    }

    return sort;
  }

}
