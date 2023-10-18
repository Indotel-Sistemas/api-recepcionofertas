const sql = require("mssql");
const { response, request } = require("express");
const { default: axios } = require("axios");
const FormData = require('form-data');
const { config } = require("../database/dbconfig");
const { v4: uuidv4 } = require('uuid');

const postOferta = async (req = request, res = response) => {
  const fecha = new Date().toISOString();
  const { usuario, idProceso } = req.body;

  try {
    let pool = await sql.connect(config);
    const usuarioIdReq = await pool.request().query(`SELECT * FROM Usuarios WHERE usuario='${usuario}'`);
    if(!usuarioIdReq.recordset.length){
      return res.status(400).json({ msg: 'Usuario no encontrado' });
    }
    const usuarioID = usuarioIdReq.recordset[0]['ID'];

    for (let i = 0; i < req.files.length; i++) {
      const nombreArchivo = req.files[i].filename;
      let query = `INSERT INTO Ofertas(ID_USUARIO, NOMBRE_ARCHIVO, IDX_ARCHIVO, FECHA, ID_PROCESO, STATUS) values (${usuarioID}, '${nombreArchivo}', '${uuidv4()}', '${fecha}', ${idProceso}, 1)`
      const result = await pool.request().query(query);
    }
    pool.close()
    return res.status(200).json({ msg: 'Oferta registrada' });

  } catch (error) {
    console.log(error);
    if (error.code === 'EREQUEST') {
      return res.status(400).json(error);

    }
    return res.status(500).json(error);
  }
}

module.exports = {
  postOferta
};
