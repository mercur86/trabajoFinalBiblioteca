package com.biblioteca.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
public class DetalleReserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Integer idDetalle;

    @ManyToOne
    @JoinColumn(name = "id_reserva", nullable = false, foreignKey = @ForeignKey(name = "fk_detalle_reserva"))
    private Reserva reserva;

    @ManyToOne
    @JoinColumn(name = "id_libro", nullable = false, foreignKey = @ForeignKey(name = "fk_detalle_libro"))
    private Libro libro;

}
