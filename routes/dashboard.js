    const { Router } = require('express')
    const { check } = require('express-validator');
    const { validarCampos } = require('../middlewares/validar-campos');
    const router = Router();


    //Funciones del Login
    const { guardarFotos, guardarData, obtenerData, obtenerPaciente } = require('../controllers/camaraController');
    const { validarJWT } = require('../middlewares/validar-jwt')

    router.post('/guardarScanner', guardarFotos)
    router.post('/saveData', validarJWT, guardarData)
    router.post('/obtenerData', validarJWT, obtenerData)
    router.post('/obtenerPaciente', validarJWT, obtenerPaciente)
    

    module.exports = router;
