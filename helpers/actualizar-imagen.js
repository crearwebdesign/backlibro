const fs = require('fs');

const Usuario = require('../models/usuario');
const Medico = require('../models/medicos');
const Hospital = require('../models/hospital');


const borrarArchivo = (path) => {
    
    //console.log(pathViejo);
    //let fileExists = fs.existsSync(pathViejo);
    //console.log("hello exists:", fileExists);
    //if (fileExists) {
    //    console.log("deleting the file");
    //    fs.unlinkSync(pathViejo)
    //  }
    if (fs.existsSync(path)){
         //borrar Imagen
        fs.unlinkSync(path)
    }
};



const actualizarImagen = async (tipo, id, nombreArchivo) => {
    let pathViejo;
    switch (tipo) {
        case 'medicos':
            const medico = await Medico.findById(id);
            if (!medico){
                console.log('Id no corresponde a ningún médico');
                return false
            };

            pathViejo = `./uploads/medicos/${medico.img}`;
            borrarArchivo(pathViejo);

            medico.img = nombreArchivo;
            await medico.save();
            return true

        break;
        case 'hospitales':
            const hospital = await Hospital.findById(id);
            if (!hospital){
                console.log('Id no corresponde a ningún Hospital');
                return false
            };

            pathViejo = `./uploads/hospitales/${hospital.img}`;
            borrarArchivo(pathViejo);

            hospital.img = nombreArchivo;
            await hospital.save();
            return true

        break;
        case 'usuarios':
            const usuario = await Usuario.findById(id);
            if (!usuario){
                console.log('Id no corresponde a ningún usuario');
                return false
            };

            pathViejo = `./uploads/usuarios/${usuario.img}`;
            borrarArchivo(pathViejo);

            usuario.img = nombreArchivo;
            await usuario.save();
            return true
        break;
    
    }

};

module.exports = {
    actualizarImagen
}