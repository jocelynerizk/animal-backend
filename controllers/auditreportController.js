const { validationResult, check } = require('express-validator');

const Car = require('../models/carModel');
const Category = require('../models/categoryModel');
const User = require('../models/userModel');
const Requirement = require('../models/requirementModel');
const Auditreport = require('../models/auditreportModel');

const getAll = async (req, res) => {
  try {
    const auditreports = await Auditreport.find({});
    res.status(200).json({
      success: true,
      message: 'Data retrieved successfully',
      data: auditreports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Unable to get data',
      error: error.message,
    });
  }
};

const getByID = async (req, res) => {
  try {
    const auditreports = await Auditreport.findById(req.params.ID);

    if (!auditreports) {
      return res.status(404).json({
        success: false,
        message: 'Data not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Data retrieved successfully',
      data: auditreports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Unable to get data by ID',
      error: error.message,
    });
  }
};

const add = async (req, res) => {
  try {
    // Validate input using express-validator
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array(),
      });
    }

    const { carId, reqID, choisi } = req.body;

    const newAuditreport = new Auditreport({
      carID: carId, // Corrected variable name
      reqID: reqID, // Corrected variable name
      choisi: choisi,
    });

    await newAuditreport.save();

    res.status(201).json({
      success: true,
      message: 'Data added successfully',
      data: newAuditreport,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Unable to add data',
      error: error.message,
    });
  }
};

const validateAddAuditReport = [
  check('carId').notEmpty().withMessage('Car ID is required'),
  check('reqID').notEmpty().withMessage('Requirement ID is required'),
  check('choisi').isBoolean().withMessage('Choisi must be a boolean value'),
];


const deleteById = async (req, res) => {
  try {

    const auditreport = await Auditreport.findById(req.params.ID);

    if (!auditreport) {
      return res.status(404).json({
        success: false,
        message: 'Data not found. Cannot delete.',
      });
    }


    const result = await Auditreport.deleteOne({ _id: req.params.ID });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Data not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Data deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Unable to delete data',
      error: error.message,
    });
  }
};

const update = async (req, res) => {
  const { carId, reqID, choisi } = req.body;

  try {
    const auditreport = await Auditreport.findByIdAndUpdate(
      req.params.ID,
      { carId, reqID, choisi },
      { new: true } // To return the updated document
    );

    if (!auditreport) {
      return res.status(404).json({
        success: false,
        message: 'Data not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Data updated successfully',
      data: auditreport,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Unable to update data',
      error: error.message,
    });
  }
};


const getByCarID = async (req, res) => {
  const { carID } = req.params;

  try {
    const existingCar = await Car.findById(carID);

    if (!existingCar) {
      return res.status(404).json({
        success: false,
        message: `Car with ID ${carID} does not exist`,
      });
    }

    const auditreports = await Auditreport.find({ carID: carID })
      .populate('reqID')  // Assuming you have defined 'ref' for reqID in the AuditReport model
      .populate('carID');  // Assuming you have defined 'ref' for carID in the AuditReport model

    if (auditreports.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No audit reports found for the car with ID ${carID}`,
      });
    }

    res.status(200).json({
      success: true,
      data: auditreports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Unable to fetch data',
      error: error.message,
    });
  }
};

module.exports = {
  
  getAll,
  getByID,
  add,
  validateAddAuditReport,
  update,
  deleteById,
  getByCarID,
};
