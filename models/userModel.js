const mongoose=require("mongoose");
const crypto = require('crypto');


 const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    image:{
       type:String,
       required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
       type:String,
       required:true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    phone:{
        type:String,
        required:true
     },
     wallet: 
     { 
      type: Number,
       default: 0
    },
    walletHistory: [
      {
        type: {
          type: String, // or whichever type you are using for 'credit' or 'debit'
        },
        amount: {
          type: Number,
        },
        description: {
         type: String, // Add a description field
       },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
     is_admin:{
        type:Number,
        required:true
     },
     is_varified:{
        type:Boolean,
        default:0
     },
     otp:{
      type:String,
      
      },
     otp_expiry_time:{
      type:Number,
      default:0
      },
        isBlocked : {
      type: Boolean,
      default:false
     },
     chosenAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
      },
      referralCode: {
         type: String,
         default: function() {
             return crypto.randomBytes(8).toString('hex');
         },
         unique: true
     },
     referralCount: {
         type: Number,
         default: 0
     },
     referralCodeUsed:{
      type:String,
      default:false
     },


     token:{
        type:String,
        default:''
     },
     wishlist:[
        { 
           product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  
        }
  
     ],
     
     cart: [
        {
          product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
          quantity: Number,
        }
      ],
    
   });
module.exports=mongoose.model('User',userSchema)