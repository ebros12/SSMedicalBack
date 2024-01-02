const express = require('express');
const db = require('../db');
const bcrypt = require('bcrypt');
const { generarJWT } = require('../helpers/jwt');
const multer = require('multer');
const moment = require('moment/moment');



  const obtenerModulos = async (req, res = express.response) => {
    const { tipo } = req.body;
    try {
      const queryStr = `SELECT * FROM modulos WHERE tipo='${tipo}'`;
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

  const obtenerTodosModulos = async (req, res = express.response) => {
    const { tipo } = req.body;
    try {
      const queryStr = `SELECT * FROM modulos`;
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

  const obtenerTipoModulo = async (req, res = express.response) => {
    const { tipo } = req.body;
    try {
      const queryStr = `SELECT tipo FROM modulos group by tipo`;
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

  const obtenerDoctor = async (req, res = express.response) => {
    const { tipo } = req.body;
    try {
      const queryStr = `SELECT * FROM doctores WHERE estado='1' `;
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


  const agregarDoctor = async (req, res = express.response) => {

      const { doctor } = req.body;
      const { nombre, celular } = doctor;
      try {
        // Verificar si ya existe un paciente con el mismo RUT en la base de datos
        const queryCheckRut = `SELECT * FROM doctores WHERE nombre = '${nombre}'`;
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
              const queryStr = `INSERT INTO doctores (id, nombre, celular, fecha, estado) VALUES (NULL, '${nombre}', '${celular}', '${moment().format('YYYY-MM-DD')}', '1');`;
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


    const editarDoctor = async (req, res = express.response) => {
      const { doctor } = req.body;
      const { nombre, celular } = doctor;
      try {
        // Verificar si ya existe un paciente con el mismo RUT en la base de datos
        const queryCheckRut = `SELECT * FROM doctores WHERE nombre = '${nombre}'`;
        db.query(queryCheckRut, (err, results, fields) => {
          if (err) {
            res.status(500).json({
              ok: false,
              msg: 'Error al verificar el nombre en la base de datos',
              error: err,
            });
          } else {
            if (results.length > 0) {
              // Ya existe un paciente con el mismo RUT, realizar la actualización
              const queryUpdate = `
                UPDATE doctores
                SET nombre = '${nombre}', celular = '${celular}', fecha = '${moment().format('YYYY-MM-DD')}'
                WHERE nombre = '${nombre}'`;
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
    obtenerModulos,
    obtenerDoctor,
    obtenerTipoModulo,
    obtenerTodosModulos,
    agregarDoctor,
    editarDoctor
  }