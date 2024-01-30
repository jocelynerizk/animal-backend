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
    getAllDetails,

} = require('../controllers/carController');
const isAuthenticated = require("../middlewares/auth");

router.post('/add',isAuthenticated(['admin', 'employee']), add)
router.delete('/delete/:ID',isAuthenticated(['admin', 'employee']),,deleteById);
router.get('/getById/:ID', getByID);
router.get('/getAll', getAll);
router.put('/update/:ID', update);
router.get('/getByCatID/:catID', getByCatID);
router.get('/getByStatus/:status', getByStatus);
router.get('/getByBarcode/:barcode', getByBarcode);
router.get('/getDetails/:ownerid', getDetails);
router.get('/gettasks/:teamid', gettasks);
router.get('/getAllDetails/', getAllDetails);

module.exports = router;