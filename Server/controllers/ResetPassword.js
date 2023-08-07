const User = require("../models/User");
const mailSender = require("../Utils/mailSender");

// resetPasswordToken

exports.resetPasswordToken = async(req,res) =>{
    try{
            //get email from req body
    const email = req.body.email;
    //email validation
    const user = await User.findOne({email:email});
    if(!user){
        return res.json({ 
            success:false,
            message:"Your email is not registered with us"
        });
    }
    //generate token
    const token = crypto.randomUUID();
    //update user by adding token and expiration token
    const updateDetails = await User.findOneAndUpdate(
        {email:email},
        {
            token:token,
            resetPasswordExpires: Date.now() + 5*60*1000,
        },
        {new:true});
    
    //create url
    const url = `http://localhost:3000/update-password/${token}`
    //send mail containing the url
    await mailSender(email,"Password Reset Link", `Password Reset link: ${url}`)
    // return response
    return res.json({
        success:true,
        message:"Email sent successfully, Please check email and change password",
    })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });

    }
}

// reset password

exports.resetPassword = async (res,req) =>{
    try{
        //data fetch
        const {password,confirmPassword,token} = req.body;
        //validation
        if(password!==confirmPassword){
            return res.json({
                success:false,
                message:"Password not matching",
            });
        }
        //get userdetails
        const userDetails = await User.findOne({token:token});

        // if no entry user invalid
        if(!userDetails){
            return res.json({
                success:false,
                message:"Token is invalid",
            });
        }
        //token time check
        if(userDetails.resetPasswordExpires < Date.now()){
            return res.json({
                success:false,
                message:"Token expired, Please regenerate",
            });
        }
        //hash pwd
        const hashedPassword = await bcrypt.hash(password,10);
        //Password update in DB

        await User.findByIdAndUpdate(
            {token:token},
            {password:hashedPassword},
            {new:true},
        )

        // return response 
        return res.status(200).json({
            success:true,
            message:"Password reseted successfully",
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}