const { Router } = require("express");
const multer = require("multer");
// const { check } = require("express-validator");
const { postOferta } = require("../controllers/ofertas.controller");

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, __dirname.replace('/routes', '/') + `/uploads`);
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
})

const uploads = multer({storage})

router.post("/add", uploads.array("files"), postOferta);


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