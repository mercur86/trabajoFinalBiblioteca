package com.biblioteca.service;

import com.biblioteca.model.Libro;

import java.util.List;

public interface ILibroService extends ICRUD<Libro, Integer> {

    List<Libro> findLibroByTitulo(String titulo);

    List<Libro> findLibroByAutor(String autor);

    List<Libro> findLibroByDisponible(Boolean disponible);

    List<Libro> search(String term);

}
