const express = require('express');
const db = require('../db');
const bcrypt = require('bcrypt');
const { generarJWT } = require('../helpers/jwt');
const multer = require('multer');
const moment = require('moment/moment');

// Configuración de multer para guardar los archivos en una carpeta específica
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // Directorio de destino para guardar los archivos
      cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
      // Generar un nombre de archivo único
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);

      cb(null, file.originalname);
    }
  });
  
  const upload = multer({ storage });


const guardarFotos = (req, res = express.response) => {
    upload.array('photos', 5)(req, res, (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({
          ok: false,
          msg: 'Error al guardar las fotos'
        });
      } else {
        // Las fotos se han guardado correctamente
        res.status(200).json({
          ok: true,
          msg: 'Fotos guardadas exitosamente'
        });
      }
    });
  };
  const guardarData = async (req, res = express.response) => {
    const { objeto } = req.body;
    const { desc, edad, fichaMedica, motivo, nombre, premedicacion, referidoPor, rut, tituloDesc, fotos } = objeto;
  
    try {
      const fotosString = JSON.stringify(fotos); // Convertir el array de fotos en una cadena JSON
  
      // Verificar si el paciente ya existe en la tabla "pacientes"
      const verificarQuery = `SELECT * FROM pacientes WHERE rut='${rut}';`;
      db.query(verificarQuery, (err, results, fields) => {
        if (err) throw err;
  
        let pacienteID;
        if (results.length === 0) {
          // Si el paciente no existe, agregarlo a la tabla "pacientes"
          const agregarPacienteQuery = `INSERT INTO pacientes (id, fichaMedica, rut, nombre, edad, contacto, fecha)
            VALUES (NULL, '${fichaMedica}', '${rut}', '${nombre}', '${edad}', '', '${moment().format("YYYY-MM-DD")}');`;
  
          db.query(agregarPacienteQuery, (err, results, fields) => {
            if (err) throw err;
  
            pacienteID = results.insertId; // Obtener el ID del paciente recién insertado
            guardarInformacion(pacienteID);
          });
        } else {
          pacienteID = results[0].id; // Obtener el ID del paciente existente
          guardarInformacion(pacienteID);
        }
      });
  
      const guardarInformacion = (pacienteID) => {
        // Agregar la información a la tabla "scanner"
        const queryStr = `INSERT INTO scanner (id, fichaMedica, rut, edad, nombre, fecha, actualizacion,
          pacienteID, referido, motivo, premedicacion, tituloDesc, descripcion, fotos)
          VALUES (NULL, '${fichaMedica}', '${rut}', '${edad}', '${nombre}', '${moment().format("YYYY-MM-DD")}', '${moment().format("YYYY-MM-DD")}',
           '${pacienteID}', '${referidoPor}', '${motivo}', '${premedicacion}', '${tituloDesc}', '${desc}', '${fotosString}');`;
  
        db.query(queryStr, (err, results, fields) => {
          if (err) throw err;
  
          if (results != '') {
            res.json({
              ok: true,
              data: results,
            });
          }
        });
      };
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: 'Por favor hable con el administrador',
        error,
      });
    }
  };
  

  
  
  
  

  const obtenerData = async (req, res = express.response) => {
    try {
      const queryStr = `SELECT * FROM scanner ORDER BY id desc`;
      const rows = db.query(queryStr, (err, results, fields) => {
        if (err) throw err;
  
        if (results != '') {
          const dataWithParsedFotos = results.map((row) => {
            const fotosArray = JSON.parse(row.fotos); // Analizar la cadena JSON y obtener el array de fotos
            return { ...row, fotos: fotosArray };
          });
  
          res.json({
            ok: true,
            data: dataWithParsedFotos,
          });
        }
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: 'Por favor hable con el administrador',
        error,
      });
    }
  };

  const obtenerPaciente = async (req, res = express.response) => {
    try {
      const queryStr = `SELECT * FROM pacientes`;
      const rows = db.query(queryStr, (err, results, fields) => {
        if (err) throw err;
  
        if (results != '') {

          res.json({
            ok: true,
            data: results,
          });
        }
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: 'Por favor hable con el administrador',
        error,
      });
    }
  };

  
  
  
  module.exports = {
    guardarFotos,
    guardarData,
    obtenerData,
    obtenerPaciente
  }