import { Category } from '../models/categoryModel.js';

const CategoryController = {
  index: async (req, res) => {
    try {
      const categories = await Category.find({}).lean().exec();
      return res.status(201).json({ 
        status: 'success', 
        message: 'successful', 
        data: categories 
      });
    } catch (err) {
      return res.status(500).json({ 
        status: 'fail', 
        message: 'server err', 
        err 
      });
    }
  },

  show: async (req, res) => {
    const { id } = req.params;
    try {
      const category = await Category.findById(id).exec();
      return res.status(201).json({ 
        status: 'success', 
        message: 'successful', 
        data: category 
      });
    } catch (err) {
      return res.status(500).json({ 
        status: 'fail', 
        message: 'server err', 
        err 
      });
    }
  },

  create: async (req, res) => {
    const { name, description, type } = req.body;
    const reqFields = ['name', 'description', 'type'];
    const { isAdmin } = req.user;

    if (!isAdmin) {
      return res.status(401).json({ 
        status: 'fail', 
        message: 'unauthorized' 
      });
    }
    
    for (const field of reqFields) {
      if (!req.body[field] ) {
        return res.status(400).json({ 
          status: 'failed', 
          message: `${field} field is required` 
        });
      }
    }

    try {
      const newCategory = new Category(req.body);
      const category = await newCategory.save();
      if (!category) {
        return res.status(400).json({ 
          status: 'fail', 
          message: 'something went wrong' 
        });
      }
      return res.status(201).json({ 
        status: 'success', 
        message: 'successful', 
        data: category 
      });
    } catch (err) {
      return res.status(500).json({ 
        status: 'fail', 
        message: 'server err', 
        err 
      });
    }
  },

  update: async (req, res) => {
    const { id: _id } = req.params;

    // Check if there's at least one information to update
    if(![ req.body.name, req.body.description, req.body.type ].some(Boolean)) {
      return res.status(400).json({
        status: "fail", 
        message: "all fields cannot be blank to update category"
      })
    }

    try {
      // Update category details in db
      const updatedCategory = await Category.findByIdAndUpdate(
        { _id },
        req.body,
        { new: true }
      );

      if(updatedCategory) {
        return res.status(200).json({ 
          status: "success", 
          message: "category updated successfully", 
          data: updatedCategory
        });
      }

    } catch (error) {
      return res.status(500).json({
        status: 'fail',
        message: error.message
      });
    }
  },

  destroy: async (req, res) => {
    const { id } = req.params;
    const { isAdmin } = req.user;

    if (!isAdmin) {
      return res.status(401).json({ 
        status: 'fail', 
        message: 'unauthorized' 
      });
    }

    try {
      const category = await Category.findById(id);
      category.deleteOne();

      return res.status(200).json({ 
          status: 'success',
          message: 'category deleted successfully', 
          data: category 
        });
    } 
    catch (err) {
      return res.status(500).json({ 
          status: 'fail', 
          message: 'server err', 
          err 
        });
    }
  }
}

export default CategoryController;