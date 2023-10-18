const { Router } = require("express");
const { getFile, getUserIdxFiles, deleteUserFile } = require("../controllers/files.controller");
// const { check } = require("express-validator");

const router = Router();

router.get("/:fileIdx", getFile);
router.post("/UserIdxFiles", getUserIdxFiles);
router.post("/deleteFile", deleteUserFile);


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