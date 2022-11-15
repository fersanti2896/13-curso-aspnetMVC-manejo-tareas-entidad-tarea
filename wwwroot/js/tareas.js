
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
        manejarErrorAPI(resp);

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
        manejarErrorAPI(resp);
    }
}

async function obtenerIDsTareas() {
    const ids = $("[name=titulo-tarea]").map(function () {
        return $(this).attr("data-id");
    }).get();

    return ids;
}

/* Enviando las tareas al backend */
async function enviarTareas(ids) {
    var data = JSON.stringify(ids);

    await fetch(`${urlTarea}/ordenar`, {
        method: 'POST',
        body: data,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

async function actualizarOrdenTareas() {
    const ids = obtenerIDsTareas();
    await enviarTareas(ids);

    /* Ordenando las tareas en memoria */
    const arregloOrden = tareaListadoViewModel.tareas.sorted(function (a, b) {
        return ids.indexOf(a.id().toString()) - ids.indexOf(b.id().toString());
    });

    tareaListadoViewModel.tareas([]);
    tareaListadoViewModel.tareas(arregloOrden);
}

async function manejarTarea(tarea) {
    if (tarea.esNuevo()) {
        return;
    }

    const resp = await fetch(`${urlTarea}/${tarea.id()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!resp.ok) {
        manejarErrorAPI(resp);
        return;
    }

    const json = await resp.json();
   
    editarTareaViewModel.id = json.id;
    editarTareaViewModel.titulo(json.titulo);
    editarTareaViewModel.descripcion(json.descripcion);

    modalEditarTarea.show();
}

$(function () {
    $("#reordenable").sortable({
        axis: 'y',
        stop: async function () {
            await actualizarOrdenTareas();
        }
    })
})