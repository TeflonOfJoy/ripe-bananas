package com.ripe_bananas.banana_bean.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

  @Bean
  public OpenAPI customOpenAPI() {
    Server server = new Server();
    server.setUrl("http://localhost:8080");
    server.setDescription("Spring Boot REST API for communicating with a " +
      "postgreSQL database containing the data related to the " +
      "movies");
    server.setDescription("Local Development");

    Server heroku_server = new Server();
    heroku_server.setUrl("https://banana-bean-ef021024f078.herokuapp.com/");
    heroku_server.setDescription("Heroku testing");

    Contact[] contacts = new Contact[3];
    contacts[0] = new Contact();
    contacts[0].setName("Stefano Golzio");
    contacts[0].setEmail("stefano.golzio@edu.unito.it");

    contacts[1] = new Contact();
    contacts[1].setName("Emanuel Nibizi");
    contacts[1].setEmail("emanuel.nibizi@edu.unito.it");

    contacts[2] = new Contact();
    contacts[2].setName("Seriano Kukaj");
    contacts[2].setEmail("seriano.kukaj@edu.unito.it");

    Info project_informations = new Info()
      .title("Banana Bean API")
      .description("Banana Bean is the Spring Boot Postgres API " +
        "for the Ripe Bananas site, " +
        "it provides access to static movie data")
      .version("0.0.1");

    return new OpenAPI()
      .info(project_informations)
      .servers(List.of(server));
  }


}
