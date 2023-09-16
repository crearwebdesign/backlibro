const { response } = require('express');

const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async (req, res) => {

    const desde = Number(req.query.desde) || 0; // conviertalo en number y si no viene nada ponlo en 0

    const [ usuarios, total] = await Promise.all([
        Usuario.find({}, 'nombre email role google img')
        .skip(desde)
        .limit(5),
        Usuario.countDocuments()
    ]);

    res.json({
        ok: true,
        usuarios,
        total
    })
};


const crearUsuario = async (req, res = response) => {

    const { password, email } = req.body;

    try {

        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail){
            return res.status(400).json({
                ok: false,
                msg : 'El correo ya esta registrado'
            })
        };

        const usuario = new Usuario(req.body);

        // Encryptar Contraseña

        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password,salt);

        // Guardar Usuario
        await usuario.save();

        // Generar el Tokehn - JWT

        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error Inesperado...Revisar logs'
        });
    };

};

const actualizarUsuario = async(req, res = response) => {
    
    const uid = req.params.id;

    try {
        const usuarioDB = await Usuario.findById( uid );
        if (!usuarioDB){
            res.status(404).json({
                ok : false,
                msg : 'No existe usuario con ese id'
            })
        };

        //Actualizaciones
        const {password, google,email, ...campos} = req.body;
        if ( usuarioDB.email !== req.body.email ){

            const existeEmail = await Usuario.findOne({email});
            if (existeEmail){
                return res.status(400).json({
                    ok : false,
                    msg : 'Ya existe un usuario con ese email'
                })
            }
        };

        if (!usuarioDB.google){
            campos.email = email;
        }else if (usuarioDB.email !== email){
            return res.status(400).json({
                ok : false,
                msg : 'Usuario de Google no pueden cambiar su correo'
            })

        };


        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid,campos,{ new : true });

        res.json({
            ok : true,
            usuario : usuarioActualizado
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok : false,
            msg : 'Error inesperado'
        })
    }

};

const borrarUsuario = async (req, res = response) =>{


    const uid = req.params.id;

    try {


        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB){
            return res.status(404).json({
                ok : false,
                msg : 'Usuario no Registrado'
            })
        };



        await Usuario.findByIdAndDelete(uid);

        res.status(200).json({
            ok : true,
            msg : 'Usuario Eliminado...'
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok : false,
            msg : 'Error Inesperado'
        })
        
    }


};

module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}