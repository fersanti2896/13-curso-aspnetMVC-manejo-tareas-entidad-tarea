
function agregarTarea() {
    tareaListadoViewModel.tareas.push(new tareaElementoListado({ id: 0, titulo: '' }));

    $("[name=titulo-tarea]").last().focus();
}

async function obtenerTareas() {
    tareaListadoViewModel.cargando(true);

    const resp = await fetch(urlTarea, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!resp.ok) {
        return;
    }

    const json = await resp.json();
    tareaListadoViewModel.tareas([]);

    json.forEach(valor => {
        tareaListadoViewModel.tareas.push(new tareaElementoListado(valor));
    });

    tareaListadoViewModel.cargando(false);
}

async function manejarFocusTarea(tarea) {
    const titulo = tarea.titulo();

    if (!titulo) {
        tareaListadoViewModel.tareas.pop();

        return;
    }

    const data = JSON.stringify(titulo);
    const resp = await fetch(urlTarea, {
        method: 'POST',
        body: data,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (resp.ok) {
        const json = await resp.json();
        tarea.id(json.id);
    } else {
        // Mostrando mensaje de error
    }
}