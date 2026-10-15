package com.biblioteca.controller;

import com.biblioteca.dto.ReservaDTO;
import com.biblioteca.model.DetalleReserva;
import com.biblioteca.model.Reserva;
import com.biblioteca.service.IReservaService;
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
@RequestMapping("/v1/reservas")
@RequiredArgsConstructor
public class ReservaController {

    private final IReservaService service;
    private final ModelMapper defaultMapper;

    @GetMapping
    public ResponseEntity<List<ReservaDTO>> findAll() {
        List<ReservaDTO> dtoList = service.findAll().stream().map(this::convertToDto).toList();
        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservaDTO> findById(@PathVariable Integer id) {
        return ResponseEntity.ok(convertToDto(service.findById(id)));
    }

    //una reserva con uno o mas libros: el request trae cliente, fecha y detalles[].libro
    @PostMapping
    public ResponseEntity<Void> save(@Valid @RequestBody ReservaDTO dto) {
        Reserva entity = convertToEntity(dto);
        entity.setIdReserva(null);

        Reserva obj = service.save(entity);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(obj.getIdReserva()).toUri();

        return ResponseEntity.created(location).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReservaDTO> update(@PathVariable Integer id, @Valid @RequestBody ReservaDTO dto) throws Exception {
        Reserva obj = service.update(id, convertToEntity(dto));
        return ResponseEntity.ok(convertToDto(obj));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    //reservas de un cliente: fecha, cliente y libros reservados
    @GetMapping("/cliente/{idCliente}")
    public ResponseEntity<List<ReservaDTO>> findByCliente(@PathVariable Integer idCliente) {
        List<ReservaDTO> dtoList = service.findByCliente(idCliente).stream().map(this::convertToDto).toList();
        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/hateoas/{id}")
    public EntityModel<ReservaDTO> findByIdHateoas(@PathVariable Integer id) {
        ReservaDTO dto = convertToDto(service.findById(id));

        EntityModel<ReservaDTO> entityModel = EntityModel.of(dto);
        WebMvcLinkBuilder link1 = linkTo(methodOn(ReservaController.class).findById(id));
        WebMvcLinkBuilder link2 = linkTo(methodOn(ReservaController.class).findAll());
        WebMvcLinkBuilder link3 = linkTo(methodOn(LanguageController.class).changeLanguage("ES"));

        entityModel.add(link1.withRel("reserva-details"));
        entityModel.add(link2.withRel("all-reservas"));
        entityModel.add(link3.withRel("ES-language"));

        return entityModel;
    }

    private Reserva convertToEntity(ReservaDTO dto) {
        Reserva entity = defaultMapper.map(dto, Reserva.class);

        //DetalleReserva es el lado dueno de la FK (id_reserva); el mapper no lo
        //rellena porque el DTO no expone la referencia inversa, asi que se enlaza a mano
        if (entity.getDetalles() != null) {
            for (DetalleReserva detalle : entity.getDetalles()) {
                detalle.setReserva(entity);
            }
        }

        return entity;
    }

    private ReservaDTO convertToDto(Reserva entity) {
        return defaultMapper.map(entity, ReservaDTO.class);
    }
}
