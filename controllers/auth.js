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
              rol:results[0].rol,
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
      console.log(emailExists,"emailExists")
      if (emailExists) {
        return res.status(400).json({
          ok: false,
          msg: 'El correo electrónico ya está registrado',
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(pass, salt);

      const queryStr = `INSERT INTO usuario (id, usuario, email, rol, pass, salt, estado) VALUES (NULL, ?, ?, ?, ?, ?, 1)`;
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


const modificarUsuario = async (req, res = express.response) => {
  const { usuario, email, pass, rol } = req.body;

  if ((usuario !== undefined || rol !== undefined || pass !== undefined) && email) {
    try {
      // Verificar si el usuario ya existe en la base de datos
      const userExists = await verificarEmailExistente(email);

      if (userExists) {
        // Construye la consulta y los valores según los campos proporcionados
        let queryStr = 'UPDATE usuario SET';
        const values = [];

        if (usuario !== undefined) {
          queryStr += ' usuario = ?,';
          values.push(usuario);
        }

        if (rol !== undefined) {
          queryStr += ' rol = ?,';
          values.push(rol);
        }

        if (pass !== undefined) {
          if (pass !== '') {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(pass, salt);
            queryStr += ' pass = ?, salt = ?,';
            values.push(hash, salt);
          }
        }

        // Elimina la coma extra al final de la consulta
        queryStr = queryStr.replace(/,\s*$/, '');

        // Agrega la condición de búsqueda por el correo electrónico
        queryStr += ' WHERE email = ?';
        values.push(email);

        // Ejecuta la consulta
        const [result] = await db2.query(queryStr, values);

        if (result.affectedRows === 1) {
          const token = await generarJWT(userExists.uid, usuario || userExists.usuario);

          res.status(200).json({
            ok: true,
            uid: userExists.uid,
            name: usuario || userExists.usuario,
            rol: rol !== undefined ? rol : userExists.rol,
            token
          });
        } else {
          console.error("Error al modificar el usuario:", result.message);
          res.status(500).json({
            ok: false,
            msg: 'Usuario no pudo ser modificado',
          });
        }
      } else {
        // El usuario no existe, devuelve un error
        res.status(400).json({
          ok: false,
          msg: 'El usuario no existe',
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


const eliminarUsuario = async (req, res = express.response) => {
  const { email } = req.body;

  try {
    // Verificar si el usuario ya existe en la base de datos
    const userExists = await verificarEmailExistente(email);

    if (userExists) {
      // Construye la consulta y los valores según los campos proporcionados
      const queryStr = 'UPDATE usuario SET estado = "0" WHERE email = ?';
      const values = [email];

      // Ejecuta la consulta
      const [result] = await db2.query(queryStr, values);

      if (result.affectedRows === 1) {
        const token = await generarJWT(userExists.uid, userExists.usuario);

        res.status(200).json({
          ok: true,
          uid: userExists.uid,
          name: userExists.usuario,
          rol: userExists.rol,
          token
        });
      } else {
        console.error("Error al modificar el usuario:", result.message);
        res.status(500).json({
          ok: false,
          msg: 'Usuario no pudo ser modificado',
        });
      }
    } else {
      // El usuario no existe, devuelve un error
      res.status(400).json({
        ok: false,
        msg: 'El usuario no existe',
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
};




const obtenerEliminados = async (req, res = express.response) => {
  try {
    const queryStr = `SELECT * FROM usuario WHERE estado='0'`;
    const rows = db.query(queryStr, (err, results, fields) => {
      if (err) throw err;

      if (results != '') {

        res.json({
          ok: true,
          data: results,
        });
      }else{
        res.json({
          ok: true,
          data: [],
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

const agregarUsuario = async (req, res = express.response) => {
  const { email } = req.body;

  try {
    // Verificar si el usuario ya existe en la base de datos
    const userExists = await verificarEmailExistente(email);

    if (userExists) {
      // Construye la consulta y los valores según los campos proporcionados
      const queryStr = 'UPDATE usuario SET estado = "1" WHERE email = ?';
      const values = [email];

      // Ejecuta la consulta
      const [result] = await db2.query(queryStr, values);

      if (result.affectedRows === 1) {
        const token = await generarJWT(userExists.uid, userExists.usuario);

        res.status(200).json({
          ok: true,
          uid: userExists.uid,
          name: userExists.usuario,
          rol: userExists.rol,
          token
        });
      } else {
        console.error("Error al modificar el usuario:", result.message);
        res.status(500).json({
          ok: false,
          msg: 'Usuario no pudo ser modificado',
        });
      }
    } else {
      // El usuario no existe, devuelve un error
      res.status(400).json({
        ok: false,
        msg: 'El usuario no existe',
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
};









// Función para verificar si un correo electrónico ya existe en la base de datos
const verificarEmailExistente = async (email) => {
  try {
    const queryStr = 'SELECT * FROM usuario WHERE email = ?';
    const [result] = await db2.query(queryStr, [email]);


    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Error en verificarEmailExistente:', error);
    throw error;
  }
};
const obtenerUsuarios = async (req, res = express.response) => {
  const { tipo } = req.body;
  try {
    const queryStr = `SELECT * FROM usuario WHERE estado='1'`;
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
    logear,
    newPass,
    revalidarToken,
    crearUsuario,
    obtenerUsuarios,
    modificarUsuario,
    eliminarUsuario,
    obtenerEliminados,
    agregarUsuario
  }