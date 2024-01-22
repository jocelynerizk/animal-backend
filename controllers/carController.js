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
    const car = await Car.findById(req.params.ID);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Data not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Data retrieved successfully',
      data: car,
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
    const { catID, teamid, superid, ownerid, ...carData } = req.body;

    const [category, team, superUser, owner] = await Promise.all([
      Category.findById(catID),
      User.findById(teamid),
      User.findById(superid),
      User.findById(ownerid),
    ]);

    if (!category || !team || !superUser || !owner) {
      return res.status(400).json({
        success: false,
        message: 'Invalid data. Please check your input.',
      });
    }

    const newCar = new Car({
      ...carData,
      catID,
      teamid,
      superid,
      ownerid,
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
    const car = await Car.findById(req.params.ID);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Data not found. Cannot delete.',
      });
    }

    if (car.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Deletion is only allowed for cars with status "pending".',
      });
    }

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
  const { catID, teamid, superid, ownerid, ...carData } = req.body;

  try {
    const [category, team, superUser, owner] = await Promise.all([
      Category.findById(catID),
      User.findById(teamid),
      User.findById(superid),
      User.findById(ownerid),
    ]);

    if (!category || !team || !superUser || !owner) {
      return res.status(400).json({
        success: false,
        message: 'Invalid data. Please check your input.',
      });
    }

    const car = await Car.findByIdAndUpdate(
      req.params.ID,
      { ...carData, catID, teamid, superid, ownerid },
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
  const { catID } = req.params;

  try {
    const existingCategory = await Category.findById(catID);

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: `Category with ID ${catID} does not exist`,
      });
    }

    const cars = await Car.find({ catID }).populate('catID');

    if (cars.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No cars found for the category with ID ${catID}`,
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
    const user = await User.findById(ownerid);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with ID: ${ownerid} not found`,
      });
    }

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
    const user = await User.findById(teamid);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with ID: ${teamid} not found`,
      });
    }

    await getAllDetails(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Unable to fetch data',
      error: error.message,
    });
  }
};

const getAllDetails = async (req, res) => {
  try {
    const users = await User.find();
    const cars = await Car.find()
      .populate('ownerid')
      .populate('catID');

    if (users.length === 0 && cars.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No users or cars found',
      });
    }

    res.status(200).json({
      success: true,
      users: users,
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
  getAllDetails,
};
