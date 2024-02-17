const User=require('../models/userModel')
exports.islogin=async(req,res,next)=>{
    try {
        if(req.session.user_id){
            const user=await User.findById({_id:req.session.user_id})
            if(user.isBlocked ==true){
                req.session.destroy()
                res.redirect('/')
                
            }
        
        else{
            next()
        }
        }
        else{
            res.redirect('/')
        }
        
    } catch (error) {
        console.log(error.message);
    }
}



exports.islogout=async(req,res,next)=>{
    try {
        if(req.session.user_id){
            res.redirect('/home');
        }
        next()
    } catch (error) {
        console.log(error.message);
    }
}