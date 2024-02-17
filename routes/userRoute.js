
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user/userController');
const addressController=require('../controllers/user/address');
const couponController=require('../controllers/user/couponController')
const auth=require('../middleware/auth')
const multer=require('multer');
const path=require('path');
const storage=multer.diskStorage({
    destination:function (req,file,cb) {
        cb(null,path.join(__dirname,'../public/userimage'))
    },
    filename:function(req,file,cb){
        // const name =Date.now()+'-'+file.originalname;
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));

        // cb(null,name);
    }
})

const multerUpload = multer({storage: storage});
const {upload}=require('../middleware/imageMulter')

router.get('/register',auth.islogout, userController.register);
router.post('/register',multerUpload.single('image'),userController.userData);
router.post('/verify/:userId', userController.verify);
router.get('/login',auth.islogout, userController.login);
router.post('/login', userController.verifylogin);
router.get("/", auth.islogout,userController.homepage);
router.get("/home", auth.islogin,userController.homepage);
router.get('/email-verified', userController.emailVerified);
router.get('/logout',auth.islogin,userController.userLogout);
router.get('/product-list',userController.viewProductList);
router.get('/product/:productId',userController.viewProduct);
router.post('/resend-otp/:userId',userController.resendOTP);


router.get('/view-offered-categories', userController.viewOfferedCategories);
router.get('/category/:categoryId/products', userController.viewOfferedCategoriesProducts);

router.get('/editProfileImage', userController.viewEditProfileImage);
router.post('/updateProfileImage', upload.single('image'), userController.updateProfileImage);

router.get('/profile',auth.islogin,userController.viewProfile);
router.get('/editProfileForm', userController.viewEditProfileForm);
router.post('/updateProfile',userController.updateProfile);
router.get ('/change-password',auth.islogin,userController.loadchangepassword);
router.post('/changepass',auth.islogin,userController.changepassword);


router.get('/forgot',userController.forgotLoad);
router.post('/forgot',userController.forgotPass);
router.get('/forgot-password',userController.forgotpassword);
router.post('/forgot-password',userController.restPassword);
router.get('/address',auth.islogin,addressController.loadAdreess);
router.get('/add-Address',auth.islogin,addressController.loadaddAddress);
router.post('/add-Address',addressController.addAddress);
router.get('/update-address/:addressId',auth.islogin,addressController.loadEditAddress);
router.post('/update-address/:addressId',auth.islogin,addressController.updateAddress);
router.get('/delete-address/:addressId',auth.islogin,addressController.deleteAddress);

//cart router
router.get('/cartList',auth.islogin,userController.loadCartList);
router.get('/add-to-cart/:productId',userController.addtoCart);
router.get('/deleteCartItem/:userId/:productId',userController.deleteCart);
router.post('/updateCartItemQuantity/:productId',userController.updateQuantity)
//checkout address route
router.get('/chooseAddress',auth.islogin,addressController.chooseAddress);
router.post('/SelectedAddress',auth.islogin,addressController.SelectedAddress);
router.get('/choose-addAddress',auth.islogin,addressController.chooseaddAddress);
router.post('/addnewaddress',auth.islogin,addressController.addnewAddress);
router.get('/edit-address/:addressId',auth.islogin,addressController.loadAddressEdit);
router.post('/edit-address/:addressId',auth.islogin,addressController.ediAddress);
router.get('/delete-chooseaddress/:addressId',auth.islogin,addressController.deletechooseAddress);


//checkout
router.get('/checkout',auth.islogin,userController.loadcheckout);
router.get('/ordersucess',auth.islogin,userController.orderSucess);
router.post('/place-order',auth.islogin,userController.placeorder);

// oderhistory

router.get('/order-history', auth.islogin, userController.loadorderHistory);
router.post('/cancel-order/:orderId', auth.islogin, userController.orderCancel);
router.get('/reasonpage/:orderId', auth.islogin, userController.reasonpage);
router.get('/view-order/:orderId', userController.viewOrder);
router.post('/orders/:orderId/return', userController.requestReturn);

// whitelist
router.get('/wishlist' ,auth.islogin,userController.whitelist);
router.get('/addwhitelist/:productId',auth.islogin,userController.addwhitelist);
router.get('/wishlist/:productId',userController.deletewishlist);

//coupon management
router.get('/loadcoupon',auth.islogin,couponController.loadCoupon);

router.get('/razorpayPage',userController.razorpayPage)
router.post('/capture-payment',userController.capturePayment)

router.post('/razorpay-callback', userController.handleRazorpayCallback);

router.get('/wallet',auth.islogin,userController.wallet);
module.exports = router;
