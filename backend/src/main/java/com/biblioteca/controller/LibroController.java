package com.biblioteca.controller;

import com.biblioteca.dto.LibroDTO;
import com.biblioteca.model.Libro;
import com.biblioteca.service.ILibroService;
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
@RequestMapping("/v1/libros")
@RequiredArgsConstructor
public class LibroController {

    private final ILibroService service;
    private final ModelMapper defaultMapper;

    @GetMapping
    public ResponseEntity<List<LibroDTO>> findAll() {
        List<LibroDTO> dtoList = service.findAll().stream().map(this::convertToDto).toList();
        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LibroDTO> findById(@PathVariable Integer id) {
        return ResponseEntity.ok(convertToDto(service.findById(id)));
    }

    @PostMapping
    public ResponseEntity<Void> save(@Valid @RequestBody LibroDTO dto) {
        Libro entity = convertToEntity(dto);
        entity.setIdLibro(null);
        Libro obj = service.save(entity);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(obj.getIdLibro()).toUri();

        return ResponseEntity.created(location).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<LibroDTO> update(@PathVariable Integer id, @Valid @RequestBody LibroDTO dto) throws Exception {
        Libro obj = service.update(id, convertToEntity(dto));
        return ResponseEntity.ok(convertToDto(obj));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search/titulo")
    public ResponseEntity<List<LibroDTO>> searchByTitulo(@RequestParam("titulo") String titulo) {
        List<LibroDTO> dtoList = service.findLibroByTitulo(titulo).stream().map(this::convertToDto).toList();
        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/search/autor")
    public ResponseEntity<List<LibroDTO>> searchByAutor(@RequestParam("autor") String autor) {
        List<LibroDTO> dtoList = service.findLibroByAutor(autor).stream().map(this::convertToDto).toList();
        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/search/disponible")
    public ResponseEntity<List<LibroDTO>> searchByDisponible(@RequestParam("disponible") Boolean disponible) {
        List<LibroDTO> dtoList = service.findLibroByDisponible(disponible).stream().map(this::convertToDto).toList();
        return ResponseEntity.ok(dtoList);
    }

    //buscador combinado: por titulo, autor o isbn
    @GetMapping("/search")
    public ResponseEntity<List<LibroDTO>> search(@RequestParam("term") String term) {
        List<LibroDTO> dtoList = service.search(term).stream().map(this::convertToDto).toList();
        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/hateoas/{id}")
    public EntityModel<LibroDTO> findByIdHateoas(@PathVariable Integer id) {
        LibroDTO dto = convertToDto(service.findById(id));

        EntityModel<LibroDTO> entityModel = EntityModel.of(dto);
        WebMvcLinkBuilder link1 = linkTo(methodOn(LibroController.class).findById(id));
        WebMvcLinkBuilder link2 = linkTo(methodOn(LibroController.class).findAll());
        WebMvcLinkBuilder link3 = linkTo(methodOn(LanguageController.class).changeLanguage("ES"));

        entityModel.add(link1.withRel("libro-details"));
        entityModel.add(link2.withRel("all-libros"));
        entityModel.add(link3.withRel("ES-language"));

        return entityModel;
    }

    private Libro convertToEntity(LibroDTO dto) {
        return defaultMapper.map(dto, Libro.class);
    }

    private LibroDTO convertToDto(Libro entity) {
        return defaultMapper.map(entity, LibroDTO.class);
    }
}
