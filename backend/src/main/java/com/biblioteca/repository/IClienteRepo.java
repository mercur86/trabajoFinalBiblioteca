package com.biblioteca.repository;

import com.biblioteca.model.Cliente;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IClienteRepo extends IGenericRepo<Cliente, Integer> {

    boolean existsByCedula(String cedula);

    boolean existsByEmail(String email);

    //busqueda por nombres, apellidos, cedula o email (case-insensitive).
    //solo devuelve coincidencias: no obliga a cargar toda la tabla en el frontend
    @Query("""
            SELECT c FROM Cliente c
            WHERE LOWER(c.nombres) LIKE LOWER(CONCAT('%', :term, '%'))
               OR LOWER(c.apellidos) LIKE LOWER(CONCAT('%', :term, '%'))
               OR LOWER(c.cedula) LIKE LOWER(CONCAT('%', :term, '%'))
               OR LOWER(c.email) LIKE LOWER(CONCAT('%', :term, '%'))
            ORDER BY c.apellidos, c.nombres
            """)
    List<Cliente> searchByTerm(@Param("term") String term);
}
