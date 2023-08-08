const Tag = require("../models/Tags");

//tag handler function

exports.createTag = async (req,res) =>{
    try{
      const {name,description} = req.body;
      
      if(!name || !description) {
        return res.status(400).json({
            success:false,
            message:"All fields are required", 
        })
      }

      // entry in db

    const tagDetails = await Tag.create({
        name:name,
        description:description,
    });
    return res.status(200).json({
        success:true,
        message:"Tag Created Successfully", 
    })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message, 
        })
    }
}

exports.showAllTags = async (req,res) =>{
    try{
        const allTags=await Tags.find({},{name:true,description:true});
        res.status(200).json({
            success:false,
            message:"All tags returned successfully", 
            allTags,
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message, 
        })
    }
}