const sql = require("mssql");
const { config } = require("../database/dbconfig");
const { response, request } = require("express");

const postProceso = async (req = request, res = response) => {
  const fecha = new Date().toISOString();
  const { nombre, descripcion, creador } = req.body;

  try {
    let pool = await sql.connect(config);
    const result = await pool.request().query(`INSERT INTO Procesos(NOMBRE, DESCRIPCION, FECHA, STATUS, CREADOR) values ('${nombre}', '${descripcion}', '${fecha}', 1, '${creador}')`);
    console.log(result)
    pool.close()
    return res.status(200).json({ msg: 'Procesos registrado' });

  } catch (error) {
    console.log(error);
    if (error.code === 'EREQUEST') {
      return res.status(400).json(error);

    }
    return res.status(500).json(error);
  }
}

// const getProcesos = async (req = request, res = response) => {

//   try {
//     let pool = await sql.connect(config);
//     const result = await pool.request().query(`SELECT * FROM Procesos'`);
//     const existeUsuario = !!result.recordset.length;
//     if(!existeUsuario){
//       return res.status(403).json({msg: 'Usuario no registrado'});
//     }

//     const result2 = await pool.request().query(`SELECT * FROM Usuarios WHERE Usuario = '${usuario}' AND PASSWORD='${password}'`);
//     const credenciales = !!result2.recordset.length;
//     pool.close()

//     if(!credenciales){
//       return res.status(403).json({msg: 'Contraseña incorrecta'});
//     }

//     return res.status(200).json({msg: 'Acceso exitoso'});
//   } catch (error) {
//     console.log(error);
//     if (error.code === 'EREQUEST') {
//       return res.status(400).json(error);
//     }
//     return res.status(500).json(error);
//   }
// }

const getProcesos = async (req = request, res = response) => {
  try {
    let pool = await sql.connect(config);
    const result = await pool.request().query(`SELECT * FROM Procesos`);
    pool.close()
    return res.status(200).json(result.recordset);
  } catch (error) {
    console.log(error);
    if (error.code === 'EREQUEST') {
      return res.status(400).json(error);
    }
    return res.status(500).json(error);
  }
}

const getProcesosParticipacionUsuario = async (req = request, res = response) => {
  const { usuario } = req.body;
  try {
    let pool = await sql.connect(config);
    const usuarioIdReq = await pool.request().query(`SELECT * FROM Usuarios WHERE usuario='${usuario}'`);
    if (!usuarioIdReq.recordset.length) {
      return res.status(400).json({ msg: 'Usuario no encontrado' });
    }
    const usuarioID = usuarioIdReq.recordset[0]['ID'];

    const result = await pool.request().query(` SELECT P.* FROM Procesos P 
    INNER JOIN Participacion_Procesos PP ON P.ID = PP.ID_PROCESO
    INNER JOIN Usuarios U ON U.ID = PP.ID_USUARIO
    WHERE U.ID = ${usuarioID}`);
    pool.close()
    return res.status(200).json(result.recordset);
  } catch (error) {
    console.log(error);
    if (error.code === 'EREQUEST') {
      return res.status(400).json(error);
    }
    return res.status(500).json(error);
  }
}

const getUsuariosProceso = async (req = request, res = response) => {
  const { idProceso } = req.body;
  try {
    let pool = await sql.connect(config);
    const result = await pool.request().query(`SELECT PP.ID
          ,PP.ID_USUARIO
          ,U.USUARIO
          ,U.EMPRESA
          ,PP.ID_PROCESO
      FROM [RECEPCION_OFERTAS].[dbo].[Participacion_Procesos] PP
      INNER JOIN Usuarios U on U.ID = PP.ID_USUARIO
      WHERE PP.ID_PROCESO = ${idProceso}`);
    pool.close()
    return res.status(200).json(result.recordset);
  } catch (error) {
    console.log(error);
    if (error.code === 'EREQUEST') {
      return res.status(400).json(error);
    }
    return res.status(500).json(error);
  }
}



module.exports = {
  postProceso,
  getProcesos,
  getProcesosParticipacionUsuario,
  getUsuariosProceso
  // postChecktUsuario,
  // postLogin
  // getTipo,
  // getCapacitaciones,
  // getCapacitacionesPorTipo,
  // postCapacitacion
};
