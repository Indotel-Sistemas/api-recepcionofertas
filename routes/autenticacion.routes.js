const { Router } = require("express");
// const { check } = require("express-validator");
const { postRegistrar, checktUsuario, postChecktUsuario, postLogin } = require("../controllers/autenticacion.controller");

const router = Router();

router.post("/registrar", postRegistrar);
router.post("/checkusuario", postChecktUsuario);
router.post("/login", postLogin);

// router.get("/tipos", getTipo);

// router.post("/porTipo", getCapacitacionesPorTipo);

// router.post("/solicitud", [
//     check('empleados', "El empleado a capacitar es obligatorio").not().isEmpty(),
//     // check('capacitacionId', "La capacitacion es obligatoria").not().isEmpty(),
//     // check('motivo', "El motivo es obligatorio").not().isEmpty(),
//     check('duracion', "La duracion es obligatoria").not().isEmpty(),
//     check('tipoDuracion', "El tipo de duracion es obligatorio").not().isEmpty(),
//     validarCampos
// ],
//     postCapacitacion
// );



module.exports = router;