using AutoMapper;
using ManejoTareas.Entities;
using ManejoTareas.Models;

namespace ManejoTareas.Services {
    public class AutoMapperProfiles : Profile {
        public AutoMapperProfiles() {
            CreateMap<Tarea, TareaDTO>();
        }
    }
}
