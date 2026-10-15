package com.biblioteca.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MapperConfig {

    //Mapper generico: los DTOs siguen el mismo nombre de campo que sus entidades,
    //y ninguno expone la referencia inversa que podria recursar el mapeo
    @Bean
    public ModelMapper defaultMapper() {
        return new ModelMapper();
    }

}
