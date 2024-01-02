const { Router } = require('express')
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const router = Router();


//Funciones del Login
const { obtenerModulos, obtenerDoctor,
    obtenerTipoModulo, obtenerTodosModulos,
    agregarDoctor, editarDoctor } = require('../controllers/procedimientos');
const { validarJWT } = require('../middlewares/validar-jwt')


router.post('/obtenerModulos', validarJWT, obtenerModulos)
router.post('/obtenerDoctor', validarJWT, obtenerDoctor)
router.post('/obtenerTipoModulo', validarJWT, obtenerTipoModulo)
router.post('/obtenerTodosModulos', validarJWT, obtenerTodosModulos)
router.post('/agregarDoctor', validarJWT, agregarDoctor)
router.post('/editarDoctor', validarJWT, editarDoctor)


module.exports = router;
