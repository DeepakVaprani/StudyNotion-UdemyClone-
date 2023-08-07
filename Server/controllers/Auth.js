const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
// sendOTP

exports.sendOTP = async(req, res) =>{

    try{
        
        const {email} = req.body;
        const checkUserPrsent = await User.findOne({email});

        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message:"User already registered",
            })
        }

        //generate otp
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets:false,
            lowerCaseAlphabet:false,
            specialChars:false,
        });
        console.log("Otp generated");

        // check unique otp or not

        let result = await OTP.findOne({otp:otp});

        while(result) {
            otp=otpGenerator.generate(6, {
                upperCaseAlphabets:false,
                lowerCaseAlphabet:false,
                specialChars:false,
            });
             result = await OTP.findOne({otp:otp});
        
        }

        const otpPayLoad = {email,otp};

        //create an entry for otp
        const otpBody = await OTP.create(otpPayLoad);

        //return response
        res.status(200).json({
            success : true,
            message: "OTP Sent Successfully",
            otp,
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message: error.message,
        })
    }
}

// signup

exports.signUp = async(req,res) =>{
    
    try{
        
    const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        contactNumber,
        otp } = req.body;

        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(403).json({
                success:false,
                message:"All fields are validated",
            });
        }

        //check user already exist or not

        const existingUser = await User.findOne({email});

        if(existingUser) {
            return res.status(400).json({
                success:false,
                message:"User already registered",
            });
        }

        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        if(recentOtp.length == 0){
            return res.status(400).json({
                success:false,
                message:"OTP not found"
            });
        }

        else if(otp !== recentOtp.otp){
            //invalid otp
            return res.status(400).json({
                success:false,
                message:"Invalid OTP"
            });
        }

        const hashedPassword = await bcrypt.hash(password,10);

        // create entry in DB
        const profileDetails = await Profile.create({
            gender:null,
            dateofBirth:null,
            about:null,
            contactNumber:null,
        });

        const user = await User.create({
            firstName,
            lastName,
            email,
            password:hashedPassword,
            accountType,
            additionalDetails:profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        });

        return res.status(200).json({
            success:true,
            message:"User is registered",
            user,
        });

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"User cannot be resgistered",
        });
    }

    // login

    exports.login = async (req,res) =>{
        try{
            const {email,password} = req.body;

            if(!email || !password) {
                return res.status(403).json({
                    success:false,
                    message:"All fields are required please try again",
                });
            }

            // check user exist or not 

            const user = await User.findOne({email}).populate("additionalDetails");

            if(!user){
                return res.status(401).json({
                    success:false,
                    message:"User is not registered please sign up",
                });
            }

            //generate JWT, after password match
            if(await bcrypt.compare(password,user.password)){
                const payload = {
                    email:user.email,
                    id:user_id,
                    accountType:user.accountType,
                }

                const token = jwt.sign(payload, process.env.JWT_SECRET,{
                    expiresIn:"2h",
                });
                user.token = token;
                user.password=undefined;

                //generate cookie
                const options = {
                    expires : new Date(Date.now() + 3*24*60*60*1000)
                }
                res.cookie("token", token, options).status(200).json({
                    success:true,
                    token,
                    user,
                    message: 'logged in successfully',
                })
            }

            else{
                return res.status(401).json({
                    success:false,
                    message:'Password is incorrect',
                });
            }
        }
        catch(error){
            console.log(error);
            return res.status(500).json({
                success:false,
                message:'login Failure, Please try again'
            })
       }
    }

    //change password
/*
    exports.changePassword = async(req,res) =>{
        try{
            //get data from req
        //get oldPassword,newPassword,confirmPAssword
        //validation
        }
        catch(error){

        }
    }*/
    

}