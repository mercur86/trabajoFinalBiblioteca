package com.biblioteca.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReservaDTO {

    private Integer idReserva;

    @NotNull
    private LocalDateTime fechaReserva;

    //sin @Valid: del cliente solo interesa el idCliente (sus datos ya existen).
    //el servicio valida que el id no sea nulo (400)
    @NotNull
    private ClienteDTO cliente;

    //una reserva exige uno o mas libros
    @NotEmpty
    @Valid
    private List<DetalleReservaDTO> detalles;

}
