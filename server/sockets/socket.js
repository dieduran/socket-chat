const { io } = require('../server');

const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utilidades/utilidades');

const usuarios = new Usuarios();

io.on('connection', (client) => {
    client.on('entrarChat',(data, callback)=>{
        if (!data.nombre || !data.sala){
            return callback({
                error: true,
                mensaje: 'El nombre/sala es necesario'
            });
        }
        client.join(data.sala); //lo unimos a una sala

        usuarios.agregarPersona(client.id, data.nombre, data.sala);

        client.broadcast.to(data.para).emit('listaPersona', usuarios.getPersonaPorSala(data.sala));

        callback(usuarios.getPersonaPorSala(data.sala))
    })

    client.on('crearMensaje', (data) =>{

        let persona= usuarios.getPersona(client.id);
        let mensaje= crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala),emit('crearMensaje', mensaje);

    });

    client.on('disconnect', ()=>{
        let personaBorrada = usuarios.borrarPersona(client.id);
        //console.log(personaBorrada)
        //client.broadcast.emit('crearMensaje', {usuario: 'Administrador', mensaje: `${personaBorrada.nombre} abandonó el chat.`})
        if(!personaBorrada.nombre){
            console.log('salimos sin nombre')
            return
        }
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Admin',`${personaBorrada.nombre} salió`))
        client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonaPorSala(personaBorrada.sala));
    })

    client.on('mensajePrivado', data =>{
        let persona= usuarios.getPersona(client.id);
        console.log(persona.nombre)
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));



    })
});