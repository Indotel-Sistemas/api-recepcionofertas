const sql = require("mssql");
const { config } = require("../database/dbconfig");
const { response, request } = require("express");

const postRegistrar = async (req = request, res = response) => {
  const fecha = new Date().toISOString();
  const { empresa, usuario, password } = req.body;

  try {
    let pool = await sql.connect(config);
    const result = await pool.request().query(`INSERT INTO Usuarios(EMPRESA, USUARIO, PASSWORD, FECHA) values ('${empresa}', '${usuario}', '${password}', '${fecha}')`);
    pool.close()
    return res.status(200).json({ msg: 'Usuario registrado' });

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
    if (!existeUsuario) {
      return res.status(403).json({ msg: 'Usuario no registrado' });
    }

    const result2 = await pool.request().query(`SELECT * FROM Usuarios WHERE Usuario = '${usuario}' AND PASSWORD='${password}'`);
    const credenciales = !!result2.recordset.length;
    pool.close()

    if (!credenciales) {
      return res.status(403).json({ msg: 'Contraseña incorrecta' });
    }

    return res.status(200).json({ msg: 'Acceso exitoso', data_usuario: { usuario: result.recordset[0].USUARIO, empresa: result.recordset[0].EMPRESA } });
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
    return res.status(200).json({ existe: !!result.recordset.length });
  } catch (error) {
    console.log(error);
    if (error.code === 'EREQUEST') {
      return res.status(400).json(error);
    }
    return res.status(500).json(error);
  }
}


module.exports = {
  postRegistrar,
  postChecktUsuario,
  postLogin
};
