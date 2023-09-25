const sql = require("mssql");
const { config } = require("../database/dbconfig");
const { response, request } = require("express");

const postRegistrar = async (req = request, res = response) => {
  const fecha = new Date().toISOString();
  const { empresa, usuario, password } = req.body;

  try {
    let pool = await sql.connect(config);
    const result = await pool.request().query(`INSERT INTO Usuarios(EMPRESA, USUARIO, PASSWORD, FECHA) values ('${empresa}', '${usuario}', '${password}', '${fecha}')`);
    console.log(result)
    pool.close()
    return res.status(200).json(result.rowsAffected[0]);

  } catch (error) {
    console.log(error);
    if (error.code === 'EREQUEST') {
      return res.status(400).json(error);

    }
    return res.status(500).json(error);
  }
}


const postLogin = async (req = request, res = response) => {
  const { usuario, password } = req.body;

  try {
    let pool = await sql.connect(config);
    const result = await pool.request().query(`SELECT * FROM Usuarios WHERE Usuario = '${usuario}'`);
    const existeUsuario = !!result.recordset.length;
    if(!existeUsuario){
      return res.status(403).json({msg: 'Usuario no registrado'});
    }
    
    const result2 = await pool.request().query(`SELECT * FROM Usuarios WHERE Usuario = '${usuario}' AND PASSWORD='${password}'`);
    const credenciales = !!result2.recordset.length;
    pool.close()
    
    if(!credenciales){
      return res.status(403).json({msg: 'Contraseña incorrecta'});
    }
    
    return res.status(200).json({msg: 'Acceso exitoso'});
  } catch (error) {
    console.log(error);
    if (error.code === 'EREQUEST') {
      return res.status(400).json(error);
    }
    return res.status(500).json(error);
  }
}

const postChecktUsuario = async (req = request, res = response) => {
  const { usuario } = req.body;

  try {
    let pool = await sql.connect(config);
    const result = await pool.request().query(`SELECT * FROM Usuarios WHERE Usuario = '${usuario}'`);
    console.log(result)
    pool.close()
    return res.status(200).json({existe: !!result.recordset.length});
  } catch (error) {
    console.log(error);
    if (error.code === 'EREQUEST') {
      return res.status(400).json(error);
    }
    return res.status(500).json(error);
  }
}

// const getTipo = async (req, res = response) => {

//   try {
//     let pool = await sql.connect(configPro);

//     const resultTipo = await pool.request().query(`SELECT * from TIPO`);
//     pool.close()
//     return res.status(200).json(resultTipo.recordset);

//   } catch (error) {
//     console.log(error);
//     return res.status(500).json(error);
//   }
// }

// const getCapacitacionesPorTipo = async (req, res = response) => {

//   const { tipo } = req.body;

//   try {
//     let pool = await sql.connect(configPro);
//     if (!tipo) {
//       return res.status(400).json({ msg: 'Paramatro tipo no recibido.' });
//     }
//     const resultCapacitacion = await pool.request().query(`SELECT Id, Capacitacion from CAPACITACION where Tipo_Id = ${tipo}`);

//     pool.close();
//     return res.status(200).json(resultCapacitacion.recordset);

//   } catch (error) {
//     console.log(error);
//     return res.status(500).json(error);
//   }
// };


// const postCapacitacion = async (req, res = response) => {

//   const { empleados, newCapacitacionName, capacitacionId, motivo, finalidadId, prioridadId, duracion, tipoDuracion, solicitante_id, mesPlanificarInicio, mesPlanificarTermino, ...data } = req.body;
//   try {

//     let pool = await sql.connect(configPro);
//     let ID_CAPACITACION;

//     if (!capacitacionId) {

//       const capacitacionValidation = await pool
//         .request()
//         .query(`SELECT Id from CAPACITACION where Capacitacion = '${newCapacitacionName.trim().toLowerCase()}' and Tipo_Id = 7`);

//       if (capacitacionValidation.recordset.length === 0) {

//         const ID_CAPACITACION_INSERTED = await pool
//           .request()
//           .query(`INSERT INTO CAPACITACION (Capacitacion, Tipo_Id)  OUTPUT Inserted.ID 
//         VALUES('${newCapacitacionName.trim().toLowerCase()}', 7)`);

//         ID_CAPACITACION = ID_CAPACITACION_INSERTED.recordset[0].ID
//       } else {
//         ID_CAPACITACION = capacitacionValidation.recordset[0].ID
//       }

//       const solicitud = await pool
//         .request()
//         .query(`INSERT INTO SOLICITUDES_CAPACITACION (
//           Capacitacion_Id,
//           Finalidad_Id,
//           Prioridad_Id,
//           Duracion,
//           TipoDuracion,
//           Centro,
//           Numero,
//           Costo,
//           Solicitante_Id,
//           MesPlanificar_Inicio, 
//           MesPlanificar_Termino
//         ) OUTPUT Inserted.ID VALUES ( 
//           ${ID_CAPACITACION},
//           ${finalidadId},
//           ${prioridadId},
//           ${duracion},
//           '${tipoDuracion}',
//           '${data.centro == undefined ? "" : data.centro}',
//           '${!data.numero ? "" : data.numero}', 
//           ${!data.costo ? 0 : data.costo},
//           ${solicitante_id},
//           ${mesPlanificarInicio},
//           ${mesPlanificarTermino}
//       )`);

//       let solicitud_id = solicitud.recordset[0].ID;

//       for (let empleadoid of empleados) {
//         await pool
//           .request()
//           .query(`INSERT INTO GRUPO_SOLICITUDES (
//                 Solicitud_Id, 
//                 Empleado_Id 
//                 ) VALUES (
//                   ${solicitud_id}, 
//                   ${empleadoid}
//               )`);

//       }

//       pool.close();
//       return res.status(200).json({ msg: "Solicitud registrada" });

//     } else {

//       const solicitud = await pool
//         .request()
//         .query(`INSERT INTO SOLICITUDES_CAPACITACION (
//                 Capacitacion_Id, 
//                 Finalidad_Id, 
//                 Prioridad_Id, 
//                 Duracion, 
//                 TipoDuracion, 
//                 Centro, 
//                 Numero, 
//                 Costo,
//                 Solicitante_id,
//                 MesPlanificar_Inicio,
//                 MesPlanificar_Termino
//                 ) OUTPUT Inserted.ID VALUES (
//                   ${capacitacionId}, 
//                   ${finalidadId}, 
//                   ${prioridadId}, 
//                   ${duracion}, 
//                   '${tipoDuracion}', 
//                   '${data.centro == undefined ? "" : data.centro}', 
//                   '${!data.numero ? "" : data.numero}', 
//                   ${!data.costo ? 0 : data.costo}, 
//                   ${solicitante_id}, 
//                   ${mesPlanificarInicio}, 
//                   ${mesPlanificarTermino}
//               )`);

//       let solicitud_id = solicitud.recordset[0].ID
//       for (let empleadoid of empleados) {

//         await pool
//           .request()
//           .query(`INSERT INTO GRUPO_SOLICITUDES (
//                 Solicitud_Id, 
//                 Empleado_Id 
//                 ) VALUES (
//                   ${solicitud_id}, 
//                   ${empleadoid}
//               )`);

//       }
//     }

//     pool.close();
//     return res.status(200).json({ msg: "Solicitud registrada" });

//   } catch (error) {
//     console.log(error);
//     return res.status(500).json(error);
//   }
// };

// const getCapacitaciones = async (req, res = response) => {

//   try {
//     let pool = await sql.connect(configPro);

//     const resultCapacitacion = await pool.request().query(`SELECT c.[Id],
//       [Capacitacion] CAPACITACION,
//       [Tipo_Id] ID_TIPO_CAPACITACION,
//       tc.Tipo TIPO_CAPACITACION
//       FROM [CAPACITACIONES].[dbo].[CAPACITACION] c
//       inner join TIPO tc on c.Tipo_Id = tc.ID`);

//     pool.close();
//     return res.status(200).json(resultCapacitacion.recordset);

//   } catch (error) {
//     console.log(error);
//     return res.status(500).json(error);
//   }
// }

module.exports = {
  postRegistrar,
  postChecktUsuario,
  postLogin
  // getTipo,
  // getCapacitaciones,
  // getCapacitacionesPorTipo,
  // postCapacitacion
};
