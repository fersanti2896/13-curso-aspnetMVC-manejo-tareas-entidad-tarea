﻿using AutoMapper;
using AutoMapper.QueryableExtensions;
using ManejoTareas.Entities;
using ManejoTareas.Models;
using ManejoTareas.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ManejoTareas.Controllers {
    [Route("api/tareas")]
    public class TareasController : ControllerBase {
        private readonly ApplicationDbContext context;
        private readonly IUsuarioRepository usuarioRepository;
        private readonly IMapper mapper;

        public TareasController(ApplicationDbContext context, 
                                IUsuarioRepository usuarioRepository,
                                IMapper mapper) {
            this.context = context;
            this.usuarioRepository = usuarioRepository;
            this.mapper = mapper;
        }

        /* Listado de tareas */
        [HttpGet]
        public async Task<List<TareaDTO>> Get() {
            var usuarioID = usuarioRepository.ObtenerUsuarioId();
            var tareas = await context.Tareas.Where(t => t.UsuarioId == usuarioID)
                                             .OrderBy(t => t.Orden)
                                             .ProjectTo<TareaDTO>(mapper.ConfigurationProvider)
                                             .ToListAsync();

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
