package com.biblioteca.controller;

import com.biblioteca.dto.CategoriaDTO;
import com.biblioteca.model.Categoria;
import com.biblioteca.service.ICategoriaService;
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
@RequestMapping("/v1/categorias")
@RequiredArgsConstructor
public class CategoriaController {

    private final ICategoriaService service;
    private final ModelMapper defaultMapper;

    @GetMapping
    public ResponseEntity<List<CategoriaDTO>> findAll() {
        List<CategoriaDTO> dtoList = service.findAll().stream().map(this::convertToDto).toList();
        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaDTO> findById(@PathVariable Integer id) {
        return ResponseEntity.ok(convertToDto(service.findById(id)));
    }

    @PostMapping
    public ResponseEntity<Void> save(@Valid @RequestBody CategoriaDTO dto) {
        Categoria entity = convertToEntity(dto);
        //id null en create: JPA siempre toma el camino persist(), nunca sobrescribe una fila existente
        entity.setIdCategoria(null);
        Categoria obj = service.save(entity);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(obj.getIdCategoria()).toUri();

        return ResponseEntity.created(location).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoriaDTO> update(@PathVariable Integer id, @Valid @RequestBody CategoriaDTO dto) throws Exception {
        Categoria obj = service.update(id, convertToEntity(dto));
        return ResponseEntity.ok(convertToDto(obj));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/hateoas/{id}")
    public EntityModel<CategoriaDTO> findByIdHateoas(@PathVariable Integer id) {
        CategoriaDTO dto = convertToDto(service.findById(id));

        EntityModel<CategoriaDTO> entityModel = EntityModel.of(dto);
        WebMvcLinkBuilder link1 = linkTo(methodOn(CategoriaController.class).findById(id));
        WebMvcLinkBuilder link2 = linkTo(methodOn(CategoriaController.class).findAll());
        WebMvcLinkBuilder link3 = linkTo(methodOn(LanguageController.class).changeLanguage("ES"));

        entityModel.add(link1.withRel("categoria-details"));
        entityModel.add(link2.withRel("all-categorias"));
        entityModel.add(link3.withRel("ES-language"));

        return entityModel;
    }

    private Categoria convertToEntity(CategoriaDTO dto) {
        return defaultMapper.map(dto, Categoria.class);
    }

    private CategoriaDTO convertToDto(Categoria entity) {
        return defaultMapper.map(entity, CategoriaDTO.class);
    }
}
