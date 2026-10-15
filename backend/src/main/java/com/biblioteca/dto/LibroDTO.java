package com.biblioteca.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LibroDTO {

    private Integer idLibro;

    @NotBlank
    @Size(max = 150, message = "{libro.titulo.size}")
    private String titulo;

    @NotBlank
    @Size(max = 100, message = "{libro.autor.size}")
    private String autor;

    @NotBlank
    @Size(max = 20, message = "{libro.isbn.size}")
    private String isbn;

    @NotNull
    private Boolean disponible;

    //sin @Valid: de la categoria solo interesa el idCategoria (nombre/descripcion/estado
    //no viajan en este request). El servicio valida que el id no sea nulo (400)
    @NotNull
    private CategoriaDTO categoria;

}
