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
public class CategoriaDTO {

    private Integer idCategoria;

    @NotBlank
    @Size(max = 100, message = "{categoria.nombre.size}")
    private String nombre;

    @NotBlank
    @Size(max = 200, message = "{categoria.descripcion.size}")
    private String descripcion;

    @NotNull
    private Boolean estado;

}
