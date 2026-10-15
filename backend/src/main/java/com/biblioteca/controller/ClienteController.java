package com.biblioteca.controller;

import com.biblioteca.dto.ClienteDTO;
import com.biblioteca.model.Cliente;
import com.biblioteca.service.IClienteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
@RequestMapping("/v1/clientes")
@RequiredArgsConstructor
public class ClienteController {

    private final IClienteService service;
    private final ModelMapper defaultMapper;

    @GetMapping
    public ResponseEntity<List<ClienteDTO>> findAll() {
        List<ClienteDTO> dtoList = service.findAll().stream().map(this::convertToDto).toList();
        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteDTO> findById(@PathVariable Integer id) {
        return ResponseEntity.ok(convertToDto(service.findById(id)));
    }

    @PostMapping
    public ResponseEntity<Void> save(@Valid @RequestBody ClienteDTO dto) {
        Cliente entity = convertToEntity(dto);
        entity.setIdCliente(null);
        Cliente obj = service.save(entity);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(obj.getIdCliente()).toUri();

        return ResponseEntity.created(location).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClienteDTO> update(@PathVariable Integer id, @Valid @RequestBody ClienteDTO dto) throws Exception {
        Cliente obj = service.update(id, convertToEntity(dto));
        return ResponseEntity.ok(convertToDto(obj));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    //buscador: por nombres, apellidos, cedula o email
    @GetMapping("/search")
    public ResponseEntity<List<ClienteDTO>> search(@RequestParam("term") String term) {
        List<ClienteDTO> dtoList = service.search(term).stream().map(this::convertToDto).toList();
        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/hateoas/{id}")
    public EntityModel<ClienteDTO> findByIdHateoas(@PathVariable Integer id) {
        ClienteDTO dto = convertToDto(service.findById(id));

        EntityModel<ClienteDTO> entityModel = EntityModel.of(dto);
        WebMvcLinkBuilder link1 = linkTo(methodOn(ClienteController.class).findById(id));
        WebMvcLinkBuilder link2 = linkTo(methodOn(ClienteController.class).findAll());
        WebMvcLinkBuilder link3 = linkTo(methodOn(LanguageController.class).changeLanguage("ES"));

        entityModel.add(link1.withRel("cliente-details"));
        entityModel.add(link2.withRel("all-clientes"));
        entityModel.add(link3.withRel("ES-language"));

        return entityModel;
    }

    private Cliente convertToEntity(ClienteDTO dto) {
        return defaultMapper.map(dto, Cliente.class);
    }

    private ClienteDTO convertToDto(Cliente entity) {
        return defaultMapper.map(entity, ClienteDTO.class);
    }
}
