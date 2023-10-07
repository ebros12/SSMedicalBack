const express = require('express');
const db = require('../db');
const db2 = require('../db2');
const bcrypt = require('bcrypt');
const { generarJWT } = require('../helpers/jwt');


const logear = async(req, res = express.response) => {
    
  const { email,password } = req.body
  
  try{
    const queryStr = 'SELECT * FROM `usuario` WHERE `usuario`.`email` = "'+email+'"';
    const respuesta = db.query(queryStr, async (err, results, fields) => {

        if (err) throw err;
        if(results != ''){

          const token = await generarJWT(results[0].id,results[0].usuario);
          bcrypt.compare(password,results[0].pass, function(err, result) {
          
            if(result){
              //Generar el Token
              
              res.status(200).json({
                ok:true,
                uid:results[0].id,
                name:results[0].usuario,
                rol:results[0].rol,
                token
              });
            }else{
              res.status(500).json({
                ok: false,
                msg: 'Usuario o contraseña invalidos'
              })
            }
       
        });
          
          
        }else{
          res.status(500).json({
            ok: false,
            msg: 'Usuario o contraseña invalidos'
          })
        }
        
    });
    

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador'
    })
  }

  

}

const newPass = (req, res = express.response) => {
    const { email,password } = req.body
    try{
      const queryStr = 'SELECT * FROM `usuario` WHERE `usuario`.`email` = "'+email+'"';
      db.query(queryStr, (err, results, fields) => {

          if (err) throw err;
          
          if(results != ''){

            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(password, salt, function(err, hash) {
                  const queryStr2 = "UPDATE `usuario` SET `pass` = '"+hash+"', `salt` = '"+salt+"' WHERE `usuario`.`id` = '"+results[0].id+"' ";
                  db.query(queryStr2, (err, results, fields) => { 
                    if (err) throw err;
                    if(results != ''){
                      res.status(201).json({
                        ok: true,
                        msg: 'Usuario Modificado'
                      })
                    }else{
                      res.status(500).json({
                        ok: false,
                        msg: 'Usuario no modificado'
                      })
                    }
                  })

                });
            });
            
          }else{
            res.status(500).json({
              ok: false,
              msg: 'No existe el Usuario'
            })
          }
          
      });
      

    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        msg: 'Por favor hable con el administrador'
      })
    }

    

}

const revalidarToken = async(req, res = response ) =>{
  const uid = req.uid;
  const name = req.name;
  const token = await generarJWT(uid,name);
  const queryStr = 'SELECT * FROM `usuario` WHERE id = "'+uid+'"';
  const rolQuery = db.query(queryStr, (err, results, fields) => {

          if (err) throw err;
          
          if(results != ''){
          
            
            res.json({
              ok:true,
              uid,
              name,
              rol:results[0].u_rol,
              token
            })
             
          }
        })
 

}

const crearUsuario = async (req, res = express.response) => {
  const { usuario, email, rol, pass } = req.body;

  if (usuario && email && rol && pass) {
    try {
      // Verificar si el correo electrónico ya existe en la base de datos
      const emailExists = await verificarEmailExistente(email);

      if (emailExists) {
        return res.status(400).json({
          ok: false,
          msg: 'El correo electrónico ya está registrado',
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(pass, salt);

      const queryStr = `INSERT INTO usuario (id, usuario, email, rol, pass, salt) VALUES (NULL, ?, ?, ?, ?, ?)`;
      const values = [usuario, email, rol, hash, salt];

      const [result] = await db2.query(queryStr, values);

      if (result.affectedRows === 1) {

        const insertedUserId = result.insertId;
        const token = await generarJWT(result.insertId,result.usuario);

        res.status(200).json({
          ok: true,
          uid: insertedUserId,
          name: usuario,
          rol: rol,
          token
        });
      } else {
        console.error("Error al crear el usuario:", result.message);
        res.status(500).json({
          ok: false,
          msg: 'Usuario no pudo ser creado',
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        ok: false,
        msg: 'Por favor hable con el administrador',
        error: error.message
      });
    }
  } else {
    res.status(500).json({
      ok: false,
      msg: 'Faltan campos',
    });
  }
};



// Función para verificar si un correo electrónico ya existe en la base de datos
const verificarEmailExistente = async (email) => {
  const queryStr = 'SELECT * FROM usuario WHERE email = ?';
  const [result] = await db2.query(queryStr, [email]);

  return result.length > 0;
};

  module.exports = {
    logear,
    newPass,
    revalidarToken,
    crearUsuario
  }