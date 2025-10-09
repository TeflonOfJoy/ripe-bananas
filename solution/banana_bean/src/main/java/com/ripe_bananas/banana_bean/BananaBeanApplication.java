package com.ripe_bananas.banana_bean;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class BananaBeanApplication {

	public static void main(String[] args) {
		SpringApplication.run(BananaBeanApplication.class, args);
	}

}
