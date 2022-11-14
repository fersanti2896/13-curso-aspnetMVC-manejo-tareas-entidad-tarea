using ManejoTareas.Entities;
using ManejoTareas.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ManejoTareas.Controllers {
    [Route("api/tareas")]
    public class TareasController : ControllerBase {
        private readonly ApplicationDbContext context;
        private readonly IUsuarioRepository usuarioRepository;

        public TareasController(ApplicationDbContext context, IUsuarioRepository usuarioRepository) {
            this.context = context;
            this.usuarioRepository = usuarioRepository;
        }

        /* Listado de tareas */
        [HttpGet]
        public async Task<List<Tarea>> Get() {
            var tareas = await context.Tareas.ToListAsync();

            return tareas;
        }

        /* Creación de tarea */
        [HttpPost]
        public async Task<ActionResult<Tarea>> Post([FromBody] string titulo) {
            var usuarioID = usuarioRepository.ObtenerUsuarioId();
            var existeTarea = await context.Tareas.AnyAsync(t => t.UsuarioId == usuarioID);
            var ordenMayor = 0;

            if (existeTarea) {
                ordenMayor = await context.Tareas.Where(t => t.UsuarioId == usuarioID)
                                                 .Select(t => t.Orden)
                                                 .MaxAsync();
            }

            var tarea = new Tarea { 
                Titulo = titulo,
                UsuarioId = usuarioID,
                FechaCreacion = DateTime.UtcNow,
                Orden = ordenMayor + 1 
            };

            context.Add(tarea);
            await context.SaveChangesAsync();

            return tarea;
        }
    }
}
