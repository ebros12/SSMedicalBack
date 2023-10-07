const { Router } = require('express')
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const router = Router();


//Funciones del Login
const { obtenerPaciente, crearPaciente,
    editarData } = require('../controllers/pacientes');
const { validarJWT } = require('../middlewares/validar-jwt')


router.post('/obtenerPaciente', validarJWT, obtenerPaciente)
router.post('/crearPaciente', validarJWT, crearPaciente)
router.post('/editarData', validarJWT, editarData)


module.exports = router;
