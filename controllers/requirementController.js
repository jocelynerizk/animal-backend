const Requirement = require('../models/requirementModel');
const Category = require('../models/categoryModel');

const getAll = async (req, res) => {
  try {
    const requirements = await Requirement.find({});
    res.status(200).json({
      success: true,
      message: 'Data retrieved successfully',
      data: requirements,
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
    const requirement = await Requirement.findById(req.params.ID);

    if (!requirement) {
      return res.status(404).json({
        success: false,
        message: 'Data not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Data retrieved successfully',
      data: requirement,
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
    const { desc, desc_a, catID } = req.body;
    if (!desc || !desc_a || typeof desc !== 'string' || typeof desc_a !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid input. Please provide valid desc and desc_a values.',
      });
    }
    const newRequirement = new Requirement({
      desc,
      desc_a,
      catID,
    });

    await newRequirement.save();

    res.status(201).json({
      success: true,
      message: 'Data added successfully',
      data: newRequirement,
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
    const result = await Requirement.deleteOne({ _id: req.params.ID });

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
  const { desc, desc_a, catID } = req.body;
  if (!desc || !desc_a || typeof desc !== 'string' || typeof desc_a !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Invalid input. Please provide valid desc and desc_a values.',
    });
  }

  try {
    const requirement = await Requirement.findByIdAndUpdate(
      req.params.ID,
      { desc, desc_a, catID },
      { new: true } // To return the updated document
    );

    if (!requirement) {
      return res.status(404).json({
        success: false,
        message: 'Data not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Data updated successfully',
      data: requirement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Unable to update data',
      error: error.message,
    });
  }
};

const getAllByCategoryID = async (req, res) => {
  const { categoryID } = req.params;

  try {
    const existingCategory = await Category.findById(categoryID);

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: `Category with ID ${categoryID} does not exist`,
      });
    }

    const requirements = await Requirement.find({ catID: categoryID }).populate('catID');

    if (requirements.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No requirements found for the category with ID ${categoryID}`,
      });
    }

    res.status(200).json({
      success: true,
      data: requirements,
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
  getAllByCategoryID,
};
