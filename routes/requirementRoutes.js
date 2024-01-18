const express = require('express');
const router = express.Router();


const {
    add,
    getAll,
    getByID,
    update,
    deleteById,
    getAllByCategoryID,

} = require('../controllers/requirementController');
const isAuthenticated = require("../middlewares/auth");

router.post('/add', add)
router.delete('/delete/:ID',deleteById);
router.get('/getById/:ID', getByID);
router.get('/getAll', getAll);
router.put('/update/:ID', update);
router.get('/getAllByCategoryID/:categoryID', getAllByCategoryID);


module.exports = router;