const { Router } = require("express");
// const { check } = require("express-validator");
const {
    postProceso,
    getProcesos,
    getProcesosParticipacionUsuario,
    getUsuariosProceso
} = require("../controllers/procesos.controller");

const router = Router();

router.get("/", getProcesos);
router.post("/registrar", postProceso);
router.post("/procesosParticipacionUsuario", getProcesosParticipacionUsuario);
router.post("/usuariosProceso", getUsuariosProceso);


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