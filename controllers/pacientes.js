const express = require('express');
const db = require('../db');
const bcrypt = require('bcrypt');
const { generarJWT } = require('../helpers/jwt');
const multer = require('multer');
const moment = require('moment/moment');



  const obtenerPaciente = async (req, res = express.response) => {
    try {
      const queryStr = `SELECT * FROM pacientes WHERE estado = '0'`;
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

  const crearPaciente = async (req, res = express.response) => {
    const { paciente } = req.body;
    const { fichaMedica, rut, nombre, edad, contacto, fecha } = paciente;
    try {
      // Verificar si ya existe un paciente con el mismo RUT en la base de datos
      const queryCheckRut = `SELECT * FROM pacientes WHERE rut = '${rut}'`;
      db.query(queryCheckRut, (err, results, fields) => {
        if (err) {
          res.status(500).json({
            ok: false,
            msg: 'Error al verificar el RUT en la base de datos',
            error: err,
          });
        } else {
          if (results.length > 0) {
            // Ya existe un paciente con el mismo RUT, retornar un error
            res.status(400).json({
              ok: false,
              msg: 'Ya existe un paciente con el mismo RUT',
            });
          } else {
            // El RUT no existe en la base de datos, realizar la inserción
            const queryStr = `INSERT INTO pacientes (id, fichaMedica, rut, nombre, edad, contacto, fecha) VALUES (NULL, '${fichaMedica}', '${rut}', '${nombre}', '${edad}', '${contacto}', '${fecha}');`;
            db.query(queryStr, (err, results, fields) => {
              if (err) {
                res.status(500).json({
                  ok: false,
                  msg: 'Error al insertar el paciente en la base de datos',
                  error: err,
                });
              } else {
                res.json({
                  ok: true,
                  data: results,
                });
              }
            });
          }
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


  const editarData = async (req, res = express.response) => {
    const { paciente } = req.body;
    const { fichaMedica, rut, nombre, edad, contacto, fecha } = paciente;
    try {
      // Verificar si ya existe un paciente con el mismo RUT en la base de datos
      const queryCheckRut = `SELECT * FROM pacientes WHERE rut = '${rut}'`;
      db.query(queryCheckRut, (err, results, fields) => {
        if (err) {
          res.status(500).json({
            ok: false,
            msg: 'Error al verificar el RUT en la base de datos',
            error: err,
          });
        } else {
          if (results.length > 0) {
            // Ya existe un paciente con el mismo RUT, realizar la actualización
            const queryUpdate = `
              UPDATE pacientes
              SET fichaMedica = '${fichaMedica}', nombre = '${nombre}', edad = '${edad}', contacto = '${contacto}', fecha = '${fecha}'
              WHERE rut = '${rut}'`;
            db.query(queryUpdate, (err, results, fields) => {
              if (err) {
                res.status(500).json({
                  ok: false,
                  msg: 'Error al actualizar el paciente en la base de datos',
                  error: err,
                });
              } else {
                res.json({
                  ok: true,
                  data: results,
                  msg: 'Paciente actualizado exitosamente',
                });
              }
            });
          } else {
            res.status(400).json({
              ok: false,
              msg: 'No existe un paciente con el mismo RUT',
            });
          }
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
    obtenerPaciente,
    crearPaciente,
    editarData
  }