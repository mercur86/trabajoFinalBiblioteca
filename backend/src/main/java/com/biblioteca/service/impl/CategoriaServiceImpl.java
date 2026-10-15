package com.biblioteca.service.impl;

import com.biblioteca.model.Categoria;
import com.biblioteca.repository.ICategoriaRepo;
import com.biblioteca.repository.IGenericRepo;
import com.biblioteca.service.ICategoriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class CategoriaServiceImpl extends CRUDImpl<Categoria, Integer> implements ICategoriaService {

    private final ICategoriaRepo repo;

    @Override
    protected IGenericRepo<Categoria, Integer> getRepo() {
        return repo;
    }

}
