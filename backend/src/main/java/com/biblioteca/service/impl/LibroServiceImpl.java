package com.biblioteca.service.impl;

import com.biblioteca.model.Libro;
import com.biblioteca.repository.IGenericRepo;
import com.biblioteca.repository.ILibroRepo;
import com.biblioteca.service.ILibroService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class LibroServiceImpl extends CRUDImpl<Libro, Integer> implements ILibroService {

    private final ILibroRepo repo;

    @Override
    protected IGenericRepo<Libro, Integer> getRepo() {
        return repo;
    }

    //de la categoria solo se toma el id; sin id no hay FK valida
    @Override
    public Libro save(Libro libro) {
        if (libro.getCategoria() == null || libro.getCategoria().getIdCategoria() == null) {
            throw new IllegalArgumentException("ID DE CATEGORIA ES OBLIGATORIO");
        }
        return super.save(libro);
    }

    @Override
    public List<Libro> findLibroByTitulo(String titulo) {
        return repo.findByTituloContainsIgnoreCase(titulo);
    }

    @Override
    public List<Libro> findLibroByAutor(String autor) {
        return repo.findByAutorContainsIgnoreCase(autor);
    }

    @Override
    public List<Libro> findLibroByDisponible(Boolean disponible) {
        return repo.findByDisponible(disponible);
    }

    @Override
    public List<Libro> search(String term) {
        return repo.searchByTerm(term);
    }

}
