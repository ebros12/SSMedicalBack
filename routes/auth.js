const { Router } = require('express')
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const router = Router();


//Funciones del Login
const { logear, newPass, revalidarToken, crearUsuario,
     obtenerUsuarios, modificarUsuario, eliminarUsuario,
     obtenerEliminados, agregarUsuario } = require('../controllers/auth');
const { validarJWT } = require('../middlewares/validar-jwt')


router.post(
    "/login",
    [//middlewares
        check('email','email obligatorio').not().isEmpty().isEmail(),
        check('password','password obligatorio').not().isEmpty(),
        validarCampos
    ],
     logear);

router.post(
        "/newPass",
        [//middlewares
            check('email','email obligatorio').not().isEmpty().isEmail(),
            check('password','password obligatorio').not().isEmpty(),
            validarCampos,
        ],
            newPass);

router.get('/renew', validarJWT,revalidarToken)
router.post('/obtenerUsuarios', validarJWT,obtenerUsuarios)

router.post(
    "/crearUsuario",
    [//middlewares
        check('usuario','usuario obligatorio').not().isEmpty(),
        check('email','email obligatorio').not().isEmpty(),
        check('pass','pass obligatorio').not().isEmpty(),
        validarCampos,
    ],
        crearUsuario);

router.post(
        "/modificarUsuario",
        [//middlewares
            check('usuario','usuario obligatorio').not().isEmpty(),
            check('email','email obligatorio').not().isEmpty(),
            validarCampos,
        ],
        modificarUsuario);

        router.post('/eliminarUsuario', validarJWT, eliminarUsuario)
        router.post('/obtenerEliminados', validarJWT, obtenerEliminados)
        router.post('/agregarUsuario', validarJWT, agregarUsuario)
        
module.exports = router;
