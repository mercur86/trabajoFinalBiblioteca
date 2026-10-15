package com.biblioteca.service.impl;

import com.biblioteca.model.Cliente;
import com.biblioteca.repository.IClienteRepo;
import com.biblioteca.repository.IGenericRepo;
import com.biblioteca.service.IClienteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class ClienteServiceImpl extends CRUDImpl<Cliente, Integer> implements IClienteService {

    private final IClienteRepo repo;

    @Override
    protected IGenericRepo<Cliente, Integer> getRepo() {
        return repo;
    }

    @Override
    public List<Cliente> search(String term) {
        return repo.searchByTerm(term);
    }

}
