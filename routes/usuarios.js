/*
    Ruta: /api/usuarios
*/

const {Router} = require('express');
const {check} = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const {getUsuarios, crearUsuario,actualizarUsuario,borrarUsuario} = require('../controllers/usuarios');
const { 
         validarJWT, 
         validarADMIN_ROLE, 
         validarADMIN_ROLE_o_MismoUsuario } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/',validarJWT, getUsuarios);

router.post('/',[
                 check('nombre','El Nombre es Obligatorio').not().isEmpty(),
                 check('password','El password es Obligatorio').not().isEmpty(),
                 check('email','El email es Obligatorio').isEmail(),
                 validarCampos
             ]
             ,crearUsuario);

router.put('/:id',[
    validarJWT,
    validarADMIN_ROLE_o_MismoUsuario,
    check('nombre','El Nombre es Obligatorio').not().isEmpty(),
    check('email','El email es Obligatorio').isEmail(),
    check('role','El role es Obligatorio').not().isEmpty(),
    validarCampos
]
, actualizarUsuario);

router.delete('/:id',
              [validarJWT, validarADMIN_ROLE], 
              borrarUsuario);



module.exports = router;

