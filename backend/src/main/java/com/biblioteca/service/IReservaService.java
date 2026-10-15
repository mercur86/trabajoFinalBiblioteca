package com.biblioteca.service;

import com.biblioteca.model.Reserva;

import java.util.List;

public interface IReservaService extends ICRUD<Reserva, Integer> {

    //reservas de un cliente, con cliente y libros ya cargados
    List<Reserva> findByCliente(Integer idCliente);

}
