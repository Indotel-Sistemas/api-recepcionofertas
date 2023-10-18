const sql = require("mssql");
const path = require('path');
const { config } = require("../database/dbconfig");
const { response, request } = require("express");
const fs = require('fs');


const getFile = async (req = request, res = response) => {
  const { fileIdx } = req.params;
  const filePath = path.resolve(__dirname.replace('/controllers', '/uploads/'))
  
  try {
    let pool = await sql.connect(config);
    const result = await pool.request().query(`SELECT * FROM Ofertas WHERE IDX_ARCHIVO = '${fileIdx}'`);

    if (!result.recordset.length) {
      res.status(404).send({ msg: 'No existe ningún archivo' })
    }
    const fileName = result.recordset[0]['NOMBRE_ARCHIVO'];
    pool.close()
    res.sendFile(path.join(filePath, fileName));

  } catch (error) {
    console.log('getFile error')
    console.log(error)
    res.status(500).send({ msg: 'Error al obtner el archivo' })
  }
}

const getUserIdxFiles = async (req = request, res = response) => {
  const { usuario, idProceso } = req.body;

  try {
    let pool = await sql.connect(config);

    const usuarioIdReq = await pool.request().query(`SELECT * FROM Usuarios WHERE usuario ='${usuario}'`);
    if (!usuarioIdReq.recordset.length) {
      return res.status(400).json({ msg: 'Usuario no encontrado' });
    }

    const usuarioID = usuarioIdReq.recordset[0]['ID'];
    const result = await pool.request().query(`SELECT * FROM Ofertas WHERE ID_USUARIO = ${usuarioID} and ID_PROCESO = ${idProceso} and STATUS = 1`);
    if (!result.recordset.length) {
      res.status(200).send({ msg: 'No cuanta con archivos', data: [] })
    }
    pool.close();
    res.status(200).send({ msg: 'Archivos encontrados', data: result.recordset});

  } catch (error) {
    console.log('getUserIdxFiles error')
    console.log(error)
    res.status(500).send({ msg: 'Error al obtner el archivo' })
  }
}
const deleteUserFile = async (req = request, res = response) => {
  const { fileIdx } = req.body;
  try {
    let pool = await sql.connect(config);
    const result1 = await pool.request().query(`SELECT TOP 1 * FROM Ofertas WHERE IDX_ARCHIVO = '${fileIdx}' and STATUS = 1`);
   
    if (!result1.recordset.length) {
      res.status(404).send({ msg: 'Archivo no encontrado' })
    }
    const fileName = result1.recordset[0]['NOMBRE_ARCHIVO'];

    const result = await pool.request().query(`UPDATE Ofertas SET STATUS = 0 WHERE IDX_ARCHIVO = '${fileIdx}'`);
    if (!result.rowsAffected.length) {
      res.status(500).send({ msg: 'Error al eliminar archivo.' })
    }
    const filePath = path.resolve(__dirname.replace('/controllers', '/uploads/'))
    fs.unlinkSync(path.join(filePath,fileName));

    pool.close()
    res.status(200).send({msg:'Archivo eliminado'});

  } catch (error) {
    console.log(error)
    res.status(500).send({ msg: 'Error al eliminar el archivo' })
  }
}

module.exports = {
  getFile,
  getUserIdxFiles,
  deleteUserFile
};
