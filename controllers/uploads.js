const path = require('path');
const fs = require('fs');
const {response} = require('express');
const { v4 : uuidv4} = require('uuid');
const { actualizarImagen } = require('../helpers/actualizar-imagen');


const fileUpLoad = (req, res = response) => {

    const tipo = req.params.tipo;
    const id   = req.params.id;

    // validar tipos
    const tiposValidos = ['hospitales','medicos','usuarios'];
    if (!tiposValidos.includes(tipo)){
        return res.status(500).json({
            ok : false,
            msg : "No es un medico , usuario u hospital"
        })
    };


    // tengo acceso a los files gracias al middleware express-fileupload

    // validar que exista el archivo a subir
    if ( !req.files  || Object.keys(req.files).length === 0){
        return res.status(400).json({
            ok : false,
            msg : 'No hay ningun archivo que subir al servidor'
        })
    };


    // procesar la imagen
    const file = req.files.imagen;
    
    const nombreCortado = file.name.split('.'); // crea un arreglo con tantas separaciones como puntos
                                                // tenga el nombre, ej. imagen.1.jpg
    
    const extensionArchivo = nombreCortado[nombreCortado.length-1]; // como nombreCortado se convirtio en un
    // arreglo, acceso a la ultima posicion


    // Validar extension
    const extensionesValidas = ['jpeg','gif','jpg','png'];
    if (!extensionesValidas.includes(extensionArchivo))
    {
        return res.status(400).json({
            ok : false,
            msg : 'Extension no valida'
        })
    };

    // generar el nombre del archivo
    const nombreArchivo = `${ uuidv4()  }.${extensionArchivo}`;

    // path para guardar la imagen
    const path = `./uploads/${tipo}/${nombreArchivo}`;

    // mover la imagen
    file.mv(path, (err)=>{
        if (err){
            console.log(err);
            return res.status(500).json({
                ok : false,
                msg : 'Error al subir la imagen'
            })
        };
        // actualizar base de datos

        actualizarImagen( tipo, id, nombreArchivo);

        res.json({
            ok : true,
            ms : 'Archivo Subido',
            nombreArchivo
        })

    });

};

const retornaImagen = (req, res = response) => {
    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImagen = path.join(__dirname,`../uploads/${tipo}/${foto}`);
    if (fs.existsSync(pathImagen)){
        res.sendFile(pathImagen)
    }else{
        const pathImagen = path.join(__dirname,`../uploads/no-img.jpg`);
        res.sendFile(pathImagen)
    }

};

module.exports = {
    fileUpLoad,
    retornaImagen
}