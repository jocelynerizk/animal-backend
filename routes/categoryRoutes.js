const express = require('express');
const router = express.Router();


const {
    add,
    getAll,
    getByID,
    update,
    deleteById,

} = require('../controllers/categoryController');
const isAuthenticated = require("../middlewares/auth");

router.post('/add',isAuthenticated(['admin']), add)
router.delete('/delete/:ID',isAuthenticated(['admin']),deleteById);
router.get('/getById/:ID', getByID);
router.get('/getAll', getAll);
router.put('/update/:ID',isAuthenticated(['admin']), update);


module.exports = router;