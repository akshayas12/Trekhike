const isLogin= async(req,res,next)=>{
    try {
        
   if(req.session.user_id){
    next()
   }
   else{
    res.redirect('/admin');
   }
   
    } catch (error) {
        console.log(error.message);
    }
}




const isLogout = async (req, res, next) => {
    try {
        console.log('Checking logout:', req.session.user_id);

        if (req.session.user_id) {
           
            res.redirect('/admin/adminhome');
        } else {
           
            next();
        }
    } catch (error) {
        console.log('Error in isLogout middleware:', error.message);
        next(error); 
    }
};

module.exports={
    isLogout,
    isLogin
}
