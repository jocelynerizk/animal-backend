const express = require('express');
const router = express.Router();


const {
    getAll,
    getByID,
    add,
    update,
    deleteById,
    getByCatID,
    getByStatus,
    getByBarcode,
    getDetails,
    gettasks,

} = require('../controllers/carController');
const isAuthenticated = require("../middlewares/auth");

router.post('/add', add)
router.delete('/delete/:ID',deleteById);
router.get('/getById/:ID', getByID);
router.get('/getAll', getAll);
router.put('/update/:ID', update);
router.get('/getByCatID/:CatID', getByCatID);
router.get('/getByStatus/:Status', getByStatus);
router.get('/getByBarcode/:Barcode', getByBarcode);
router.get('/getDetails/:CatID', getDetails);
router.get('/gettasks/:CatID', gettasks);

module.exports = router;