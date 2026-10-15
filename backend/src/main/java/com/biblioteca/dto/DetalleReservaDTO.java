package com.biblioteca.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DetalleReservaDTO {

    private Integer idDetalle;

    //sin el back-reference Reserva->detalles->reserva, el JSON no cicla y el
    //mapper no necesita saltos; el servicio enlaza detalle.setReserva(entity) a mano.
    //de un libro solo interesa el idLibro (sin @Valid), el servicio valida que no sea nulo
    @NotNull
    private LibroDTO libro;

}
