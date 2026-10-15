package com.biblioteca.service.impl;

import com.biblioteca.model.Reserva;
import com.biblioteca.repository.IGenericRepo;
import com.biblioteca.repository.IReservaRepo;
import com.biblioteca.service.IReservaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
public class ReservaServiceImpl extends CRUDImpl<Reserva, Integer> implements IReservaService {

    private final IReservaRepo repo;

    @Override
    protected IGenericRepo<Reserva, Integer> getRepo() {
        return repo;
    }

    //una sola transaccion: la reserva y, por cascade ALL, todos sus DetalleReserva.
    //si un libro no existe, la FK falla y no se escribe ni la reserva ni sus detalles
    @Transactional
    @Override
    public Reserva save(Reserva reserva) {
        if (reserva.getCliente() == null || reserva.getCliente().getIdCliente() == null) {
            throw new IllegalArgumentException("ID DE CLIENTE ES OBLIGATORIO");
        }

        if (reserva.getDetalles() == null || reserva.getDetalles().isEmpty()) {
            throw new IllegalArgumentException("LA RESERVA DEBE TENER AL MENOS UN LIBRO");
        }

        //de cada detalle solo importa idLibro; un id nulo es 400 y no abre ningun insert
        boolean missingId = reserva.getDetalles().stream()
                .anyMatch(d -> d.getLibro() == null || d.getLibro().getIdLibro() == null);
        if (missingId) {
            throw new IllegalArgumentException("ID DE LIBRO ES OBLIGATORIO");
        }

        return repo.save(reserva);
    }

    @Override
    public List<Reserva> findAll() {
        return repo.findAllWithDetails();
    }

    @Override
    public List<Reserva> findByCliente(Integer idCliente) {
        return repo.findByClienteWithDetails(idCliente);
    }

}
