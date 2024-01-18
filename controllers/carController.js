const Car = require('../models/carModel');
const Category = require('../models/categoryModel');
const User = require('../models/userModel');
const getAll = async (req, res) => {
  try {
    const cars = await Car.find({});
    res.status(200).json({
      success: true,
      message: 'Data retrieved successfully',
      data: cars,
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
    const cars = await Car.findById(req.params.ID);

    if (!cars) {
      return res.status(404).json({
        success: false,
        message: 'Data not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Data retrieved successfully',
      data: cars,
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
    const { immatricule, brand, maxweight, catID, teamid, superid, ownerid, bookdate, caracteristic, status, certidate, loger, reference, barcode, dtenservice,remarks } = req.body;

    const category = await Category.findById(catID);
    const team = await User.findById(teamid);
    const superUser = await User.findById(superid);
    const owner = await User.findById(ownerid);

    if (!category || !team || !superUser || !owner) {
      return res.status(400).json({
        success: false,
        message: 'Invalid data. Please check your input.',
      });
    }


    const newCar = new Car({
      immatricule,
      brand,
      maxweight,
      catID,
      teamid,
      superid,
      ownerid,
      bookdate,
      caracteristic,
      status,
      certidate,
      loger,
      reference,
      barcode,
      dtenservice,
      remarks
    });

    await newCar.save();

    res.status(201).json({
      success: true,
      message: 'Data added successfully',
      data: newCar,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Unable to add data',
      error: error.message,
    });
  }
};
const deleteById = async (req, res) => {
  try {
    // Fetch the car by ID
    const car = await Car.findById(req.params.ID);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Data not found. Cannot delete.',
      });
    }

    // Check if the status is not 'pending'
    if (car.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Deletion is only allowed for cars with status "pending".',
      });
    }

    // Delete the car
    const result = await Car.deleteOne({ _id: req.params.ID });

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
  const { immatricule, brand, maxweight, catID, teamid, superid, ownerid, bookdate, caracteristic, status, certidate, loger, reference, barcode, dtenservice, remarks } = req.body;
  const category = await Category.findById(catID);
  const team = await User.findById(teamid);
  const superUser = await User.findById(superid);
  const owner = await User.findById(ownerid);

  if (!category || !team || !superUser || !owner) {
    return res.status(400).json({
      success: false,
      message: 'Invalid data. Please check your input.',
    });
  }

  try {
    const car = await Car.findByIdAndUpdate(
      req.params.ID,
      { immatricule, brand, maxweight, catID, teamid, superid, ownerid, bookdate, caracteristic, status, certidate, loger, reference, barcode, dtenservice, remarks },
      { new: true } // To return the updated document
    );

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Data not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Data updated successfully',
      data: car,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Unable to update data',
      error: error.message,
    });
  }
};


const getByCatID = async (req, res) => {
  const { categoryID } = req.params;

  try {
    const existingCategory = await Category.findById(categoryID);

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: `Category with ID ${categoryID} does not exist`,
      });
    }

    const cars = await Car.find({ catID: categoryID }).populate('catID');

    if (cars.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No cars found for the category with ID ${categoryID}`,
      });
    }

    res.status(200).json({
      success: true,
      data: cars,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Unable to fetch data',
      error: error.message,
    });
  }
};

const getByStatus = async (req, res) => {
  const { status } = req.params;

  try {
    // Validate status
    const validStatusValues = ['pending', 'tobeaudited', 'audited', 'locked', 'conforme', 'Notconforme', 'horservice'];
    if (!validStatusValues.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value',
      });
    }

    const cars = await Car.find({ status });

    if (cars.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No cars found with status: ${status}`,
      });
    }

    res.status(200).json({
      success: true,
      data: cars,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Unable to fetch data',
      error: error.message,
    });
  }
};

const getByBarcode = async (req, res) => {
  const { barcode } = req.params;

  try {
    const car = await Car.findOne({ barcode });

    if (!car) {
      return res.status(404).json({
        success: false,
        message: `No car found with barcode: ${barcode}`,
      });
    }

    res.status(200).json({
      success: true,
      data: car,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Unable to fetch data',
      error: error.message,
    });
  }
};

const getDetails = async (req, res) => {
  const { ownerid } = req.params;

  try {
    // Find user by ownerid
    const user = await User.findById(ownerid);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with ID: ${ownerid} not found`,
      });
    }

    // Find cars by ownerid, populate ownerid and catID
    const cars = await Car.find({ ownerid })
      .populate('ownerid')
      .populate('catID');

    if (cars.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No cars found for owner with ID: ${ownerid}`,
      });
    }

    res.status(200).json({
      success: true,
      user: user,
      cars: cars,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Unable to fetch data',
      error: error.message,
    });
  }
};

const gettasks = async (req, res) => {
  const { teamid } = req.params;

  try {
    // Find user by teamid
    const user = await User.findById(teamid);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with ID: ${teamid} not found`,
      });
    }

    // Find cars by teamid, populate teamid and catID
    const cars = await Car.find({ teamid })
      .populate('teamid')
      .populate('catID');

    if (cars.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No cars found for owner with ID: ${teamid}`,
      });
    }

    res.status(200).json({
      success: true,
      user: user,
      cars: cars,
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
  update,
  deleteById,
  getByCatID,
  getByStatus,
  getByBarcode,
  getDetails,
  gettasks,
};
