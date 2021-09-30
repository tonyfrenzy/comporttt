import { Knowledgebase } from '../models/knowledgebaseModel.js';

const KnowledgebaseController = {
  index: async (req, res) => {
    try {
      const knowledgebases = await Knowledgebase.find({}).populate('category').lean().exec();
      return res.status(201).json({ 
        status: 'success', 
        message: 'successful', 
        data: knowledgebases 
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
      const knowledgebase = await Knowledgebase.findById(id).populate('category').exec();
      return res.status(201).json({ 
        status: 'success', 
        message: 'successful', 
        data: knowledgebase 
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
    const { title, body, category } = req.body;
    const reqFields = ['title', 'body', 'category'];
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
      const newKnowledgebase = new Knowledgebase(req.body);
      const knowledgebase = await newKnowledgebase.save();
      if (!knowledgebase) {
        return res.status(400).json({ 
          status: 'fail', 
          message: 'something went wrong' 
        });
      }
      return res.status(201).json({ 
        status: 'success', 
        message: 'successful', 
        data: knowledgebase 
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
    if(![ req.body.title, req.body.body, req.body.category ].some(Boolean)) {
      return res.status(400).json({
        status: "fail", 
        message: "all fields cannot be blank to update knowledgebase"
      })
    }

    try {
      // Update knowledgebase details in db
      const updatedKnowledgebase = await Knowledgebase.findByIdAndUpdate(
        { _id },
        req.body,
        { new: true }
      );

      if(updatedKnowledgebase) {
        return res.status(200).json({ 
          status: "success", 
          message: "knowledgebase updated successfully", 
          data: updatedKnowledgebase
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
      const knowledgebase = await Knowledgebase.findById(id);
      knowledgebase.deleteOne();

      return res.status(200).json({ 
          status: 'success',
          message: 'knowledgebase deleted successfully', 
          data: knowledgebase 
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

export default KnowledgebaseController;