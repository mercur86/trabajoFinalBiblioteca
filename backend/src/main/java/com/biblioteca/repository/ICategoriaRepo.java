package com.biblioteca.repository;

import com.biblioteca.model.Categoria;

public interface ICategoriaRepo extends IGenericRepo<Categoria, Integer> {

    boolean existsByNombreIgnoreCase(String nombre);

}
