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

        Contact[] contacs = new Contact[3];
        contacs[0] = new Contact();
        contacs[0].setName("Stefano Golzio");
        contacs[0].setEmail("stefano.golzio@edu.unito.it");

        contacs[1] = new Contact();
        contacs[1].setName("Emanuel Nibizi");
        contacs[1].setEmail("emanuel.nibizi@edu.unito.it");

        contacs[2] = new Contact();
        contacs[2].setName("Seriano Kukaj");
        contacs[2].setEmail("seriano.kukaj@edu.unito.it");

        Info project_informations = new Info()
                .title("Banana Bean API")
                .description("Spring Boot REST API " +
                "communicating with a PostgreSQL DataBase retrieving the " +
                "static data related to the movies");

        return new OpenAPI()
                .info(project_informations)
                .servers(List.of(server));
    }


}
