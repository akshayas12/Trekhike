const Banner=require('../../models/BannerModel');

exports.bannerLoad=async(req,res)=>{
    try {
        res.render('bannerManagement');
    } catch (error) {
        console.log(error);
    }
}

exports.addbanner=async(req,res)=>{
    try {
        res.render('add-banner');
    } catch (error) {
        
    }
}