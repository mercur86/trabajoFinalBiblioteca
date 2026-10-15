package com.biblioteca.repository;

import com.biblioteca.model.Reserva;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IReservaRepo extends IGenericRepo<Reserva, Integer> {

    //JOIN FETCH: la lista de reservas se serializa con cliente y libros ya cargados,
    //sin N+1 ni LazyInitializationException al mapear en el controlador
    @Query("""
            SELECT DISTINCT r FROM Reserva r
            JOIN FETCH r.cliente
            LEFT JOIN FETCH r.detalles d
            LEFT JOIN FETCH d.libro l
            LEFT JOIN FETCH l.categoria
            """)
    List<Reserva> findAllWithDetails();

    @Query("""
            SELECT DISTINCT r FROM Reserva r
            JOIN FETCH r.cliente
            LEFT JOIN FETCH r.detalles d
            LEFT JOIN FETCH d.libro l
            LEFT JOIN FETCH l.categoria
            WHERE r.cliente.idCliente = :idCliente
            """)
    List<Reserva> findByClienteWithDetails(@Param("idCliente") Integer idCliente);

}
