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
  
  
  
  module.exports = {
    obtenerModulos,
    obtenerDoctor
  }