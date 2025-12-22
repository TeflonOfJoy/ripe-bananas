package com.ripe_bananas.banana_bean.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

  @Bean
  public WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurer() {
      public void addCorsMapping(CorsRegistry registry) {
        registry.addMapping("/**")
          .allowedOrigins("http://localhost:3000")
          .allowedOrigins("http://coolstuffs.altervista.org")
          .allowedMethods("GET");
      }
    };
  }

}
