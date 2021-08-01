
class Usuarios {

    constructor(){
        this.personas= [];
    }
    
    agregarPersona(id, nombre, sala){
        let persona={id, nombre, sala};
        this.personas.push(persona) // agregamos la persona
        return this.personas;
    }

    getPersona (id){
        let persona= this.personas.filter(per => {
            return per.id===id
        })[0]  //como devuelve un arreglo quiero la primera posicion
        return persona;
    }

    getPersonas(){
        return this.personas;
    }
    getPersonaPorSala(sala){
        let personasEnSala = this.personas.filter(persona =>persona.sala===sala)
        return personasEnSala;
    }

    borrarPersona(id){
        let personaBorrada= this.getPersona(id);
        //nuevo array con todas las personas menos la que quiero filtrar
        this.personas= this.personas.filter(persona => persona.id!=id); 
        return personaBorrada;
    }
}



module.exports={
    Usuarios
}
