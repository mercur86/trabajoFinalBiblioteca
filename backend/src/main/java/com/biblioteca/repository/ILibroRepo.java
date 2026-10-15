package com.biblioteca.repository;

import com.biblioteca.model.Libro;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ILibroRepo extends IGenericRepo<Libro, Integer> {

    List<Libro> findByTituloContainsIgnoreCase(String titulo);

    List<Libro> findByAutorContainsIgnoreCase(String autor);

    List<Libro> findByDisponible(Boolean disponible);

    //busqueda combinada por titulo, autor o isbn (case-insensitive)
    @Query("""
            SELECT l FROM Libro l
            WHERE LOWER(l.titulo) LIKE LOWER(CONCAT('%', :term, '%'))
               OR LOWER(l.autor) LIKE LOWER(CONCAT('%', :term, '%'))
               OR LOWER(l.isbn) LIKE LOWER(CONCAT('%', :term, '%'))
            ORDER BY l.titulo
            """)
    List<Libro> searchByTerm(@Param("term") String term);
}
