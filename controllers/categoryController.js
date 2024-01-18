const Category = require('../models/categoryModel');

const getAll = async (req, res) => {
    try {
      const categories = await Category.find({});
      res.status(200).json({
        success: true,
        message: 'Data retrieved successfully',
        data: categories,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Unable to get data',
        error: error,
      });
    }
  };
  
  const getByID = async (req, res) => {
    try {
      const category = await Category.findById(req.params.ID);
  
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Data not found',
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Data retrieved successfully',
        data: category,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Unable to get data by ID',
        error: error,
      });
    }
  };
  
  const add = async (req, res) => {
    try {
        const { title, title_a } = req.body;
   

        const newCategory = new Category({
          title,
          title_a, 
        });

        await newCategory.save();

        res.status(200).json({
            success: true,
            message: 'Data added successfully',
            data: newCategory,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Unable to add data',
            error: error.message,
        });
    }
};
  
  const deleteById = async (req, res) => {
    try {
      const category = await Category.deleteOne({ _id: req.params.ID });
      res.status(200).json({
        success: true,
        message: 'Data deleted successfully',
        data: category,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Unable to delete data',
        error: error,
      });
    }
  };
  
  const update = async (req, res) => {
    const { title, title_a, highlighted } = req.body;
    // Validate input
    if (!title || !title_a || typeof title !== 'string' || typeof title_a !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid input. Please provide valid title and title_a values.',
      });
    }
    try {
   
        const categoryData = {
          title,
          title_a,
            highlighted: highlighted || false,
        };

        const category = await Category.findByIdAndUpdate(req.params.ID, categoryData);
        res.status(200).json({
            success: true,
            message: 'Data updated successfully',
            data: category,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Unable to update data',
            error: error,
        });
    }
};


  
  module.exports = {
    getAll,
    getByID,
    add,
    update,
    deleteById,
  };