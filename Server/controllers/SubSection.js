const SubSection = require('../models/SubSection');
const Section = require('../models/Section');
const {uploadImageToCloudonary} = require('../Utils/imageUploader');
exports.createSubSection = async(req,res) =>{
    try{
        //fetch data
        const {sectionId,title,timeDuration,description} = req.body;

        //extract file and video
        const video = req.files.videoFiles;
        //validation
        if(!sectionId || !title|| !timeDuration ||!description||!video){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            })
        }
        //upload video to cloudinary
        const uploadDetails = await uploadImageToCloudonary(video,process.env.FOLDER_NAME);
        //create a subsection
        const SubSectionDetails = await SubSection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoUrl:uploadDetails.secure_url,
        })
        //update the section
        const updateSection = await Section.findByIdAndUpdate({_id:sectionid},
            {
                $push: {
                    subSection:SubSectionDetails._id,
                }
            },
            {new:true});
        //return res
        return res.status(200).json({
            success:true,
            message:"Subsection created successfully",
            updateSection,
        })

    }catch(error){
        return res.status(500).json({
            success:true,
            message:"section created successfully",
            updateCourseDetails,
        })
    }
}