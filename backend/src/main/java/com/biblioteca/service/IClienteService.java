package com.biblioteca.service;

import com.biblioteca.model.Cliente;

import java.util.List;

public interface IClienteService extends ICRUD<Cliente, Integer> {

    List<Cliente> search(String term);

}
