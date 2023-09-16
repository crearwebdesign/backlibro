/*
   Ruta: /api/login
*/

const {Router} = require('express');
const {check} = require('express-validator');

const {login, googleSignIn, renewToken} = require('../controllers/auth');
const {validarCampos} = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();

// Add routes
router.post ('/',[
    check('email','El email no debe estar vacio').isEmail(),
    check('password','El password no debe estar vacio').not().isEmpty(),
    validarCampos
], login);

router.post ('/google',[
    check('token','El Token de Google es Obligatorio').not().isEmpty(),
    validarCampos
], googleSignIn);

router.get ('/renew',
            validarJWT,
            renewToken);



module.exports = router;
