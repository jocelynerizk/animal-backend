const express = require('express');
const router = express.Router();


const {
    add,
    getAll,
    getByID,
    update,
    deleteById,
    getByCarID,

} = require('../controllers/auditreportController');
const isAuthenticated = require("../middlewares/auth");

router.post('/add', add)
router.delete('/delete/:ID',deleteById);
router.get('/getById/:ID', getByID);
router.get('/getByCarID/:CarID', getByCarID);
router.get('/getAll', getAll);
router.put('/update/:ID', ,isAuthenticated(['admin', 'employee']),update);

module.exports = router;