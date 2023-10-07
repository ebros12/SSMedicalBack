const { Router } = require('express')
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const router = Router();


//Funciones del Login
const { obtenerModulos, obtenerDoctor } = require('../controllers/procedimientos');
const { validarJWT } = require('../middlewares/validar-jwt')


router.post('/obtenerModulos', validarJWT, obtenerModulos)
router.post('/obtenerDoctor', validarJWT, obtenerDoctor)

module.exports = router;
