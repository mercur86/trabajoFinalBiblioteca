# Datos de ejemplo (testdata)

Payloads para poblar la base a través de los endpoints REST, en **orden de dependencias**:

1. `categoria.json` → `POST /v1/categorias`
2. `libro.json` → `POST /v1/libros`
3. `cliente.json` → `POST /v1/clientes`
4. `reserva.json` → `POST /v1/reservas`

Los archivos contienen **placeholders** que hay que reemplazar por los ids reales
capturados en las respuestas anteriores (o por los headers `Location`):

| Placeholder | Se reemplaza por |
| --- | --- |
| `<idCategoria>` | id de la categoría creada |
| `<idCliente>` | id del cliente creado |
| `<idLibro1>`, `<idLibro2>` | ids de los libros creados |

Nota: un archivo con placeholders sin resolver no es JSON válido; resolverlos antes de enviarlo.

Alternativa recomendada: usar la colección Postman en `postman/`, que ya encadena los ids
automáticamente.
