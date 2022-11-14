
async function manejarErrorAPI(resp) {
    let msgError = '';

    if (resp.status === 400) {
        msgError = await resp.text();
    } else if (resp.status === 404) {
        msgError = recursoNoEncontrado;
    } else {
        msgError = errorInesperado;
    }

    mostrarMsgError(msgError);
}

function mostrarMsgError(msg) {
    Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: msg
    });
}