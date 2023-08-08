const Course = require("../models/Course");
const Tag = require("../models/Tags");
const User = require("../models/User");

const {uploadImageToCloudinary} = require("../Utils/imageUploader");

exports.createCourse = async (req,res) =>{
    try{

        //fetch data
        const {courseName, courseDescription, whatYouWillLearn, price,tag} = req.body;

        //get thumbnail

        const thumbnail = req.files.thumbnailImage;

        //validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail){
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            });
        }

        //check for instructor

        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        console.log("Instructor Details: ", instructorDetails)

        if(!instructorDetails){
            return res.status(404).json({
                success:false,
                message:"Instructor Details not found",
            });
        }

        //check given tag is valid or not
        const tagDetails = await Tag.findById(tag);

        if(!tagDetails){
            return res.status(404).json({
                success:false,
                message:"Tag Details not found",
            });
        }

        //Upload Image top cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        //create an entry for new course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor:instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price,
            tag:tagDetails._id,
            thumbnail:thumbnailImage.secure_url,
        });

        //add the new course to the user schema of Instructor

        await User.findByIdAndUpdate(
            {_id:instructorDetails._id},
            {
                $push: {
                    courses:newCourse._id,
                }
            },
            {new:true},
        );

        return res.status(200).json({
            success:true,
            message:"Course Created Successfully",
            data:newCourse,
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Failed to create Course',
            error:error.message,
        })
    }
};

//getAllCourses handler function

exports.showAllCourses = async (req,res) =>{
    try{
        const allCourses = await Course.find({}, { courseName:true,
        price:true, thumbnail:true, instructor:true, ratingAndReviews:true,studesEnrolled:true,}).populate("instructor").exec();

        return res.status(200).json({
            success:true,
            message:"Data for all courses fetched successfully",
            data:allCourses,
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Cannot Fetch Course data',
            error:error.message,
        })
    }
}