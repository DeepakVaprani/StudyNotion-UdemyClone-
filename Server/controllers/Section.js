const Section = require('../models/Section');
const Course = require('../models/Course');

exports.createSection = async (req,res) => {
    try{

        //data fetch
        const {sectionName, courseId} = req.body;
        //data validation

        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:'Missing Properties',
            });
        }

        //create Section

        const newSection = await Section.create({sectionName});
        //update course with section objectId

        const updateCourseDetails = await Course.findByIdAndRemove(
            courseId,
            {
                $push : {
                    courseContent: newSection._id,
                }

        },
        {new:true},
        )

        return res.status(200).json({
            success:true,
            message:"section created successfully",
            updateCourseDetails,
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to create the section",
        })
    }
}

exports.updateSection = async(req,res) =>{
    try{
        //data input
        const {sectionName,sectionId} = req.body;
        //data validation
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:'Missing Properties',
            });
        }
        //update section
        const section = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new:true});
        //return res

        return res.status(200).json({
            success:true,
            message:"Section Updated Successfully",
           
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to update the section",
        })
    }
}

exports.deleteSection = async(req,res) =>{
    try{
        //get Id
        const {sectionId} = req.params;
        await Section.findByIdAndDelete({sectionId});

        return res.status(200).json({
            success:true,
            message:"section deleted successfully",
        })

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to delete the section",
        })
    }
}