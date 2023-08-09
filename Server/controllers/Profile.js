const Profile = require("../models/Profile");
const User = require("../models/User");

exports.updateProfile = async (req,res) =>{
    try{
        //get data
        const {dateOfBirth="",about="", contactNumber,gender}= req.body;
        //get userid
        const id = req.user.id;
        //validation
        if(!contactNumber || !gender|| !id){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            });
        }
        //find profile
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);
        //update profile
        profileDetails.dateofBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumber;
        await profileDetails.save();

        //return res
        return res.status(200).json({
            success:true,
            message:"Profile Created successfully",
            profileDetails,
        });

        
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to create profile",
        });
    }
}


//delete Accout

exports.deleteAccount = async(req,res) =>{
    try{
        //get id
        const id = req.user.id;
        //validateid
        const userDetails = await User.findById(id);
        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:"user not found",
            });
        }
        //delete profile
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails})
        // delete user
        await User.findByIdAndDelete({_id:id});

        //return response

        return res.status(200).json({
            success:true,
            message:"User Deleted Successfully",
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to delete user",
        });
    }
}

exports.getAllUserDetails = async (req,res)=>{
    try{
        const id = req.user.id;

        const userDetails = await User.findById(id).populate("additionalDetails").exec();

        return res.status(200).json({
            success:true,
            message:"User data fetched",
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}