const express = require('express');
const route = express.Router();
const adminController= require('../controllers/admin/adminController');
const categoryController=require('../controllers/admin/categoryController');
const orderController=require('../controllers/admin/orderController');
const couponController=require('../controllers/admin/couponController');
const dashboardController=require('../controllers/admin/dashboardController')
const multerMiddleware =require('../middleware/multer').upload
const auth=require('../middleware/adminauth')
route.get('/',auth.isLogout,adminController.loadLogin);
route.post('/adminlogin',adminController.verifylogin);
// route.get('/adminhome',auth.isLogin,adminController.loadHome);
route.get('/adminhome',auth.isLogin, dashboardController.getDashboardData);
route.get('/dashboard-data',auth.isLogin,dashboardController.dashboardData);
route.get('/order-data',auth.isLogin,dashboardController.orderData);
route.get('/deliveredOrders', dashboardController.salesReport); 
route.get('/downloadSalesReport', dashboardController.downloadSalesReport); 
route.get('/getUserDetailsAndOrders', dashboardController.getUserDetailsAndOrders); 
route.get('/getYearlyRevenue', dashboardController.getYearlyRevenue); 





route.get('/logout',auth.isLogin,adminController.logout);


//user mangement
route.get('/listUser',auth.isLogin,adminController.listUser);
route.get('/listUser/block_user/:id',auth.isLogin,adminController.blockUser);

//category
route.get('/category',auth.isLogin,categoryController.category);
route.get('/add-category',auth.isLogin,categoryController.addCategory)
route.post('/new-category',auth.isLogin,categoryController.newCategory);
route.get('/load-edit/:categoryId',auth.isLogin,categoryController.LoadEdit);
route.post('/edit-category/:categoryId',auth.isLogin,categoryController.ediCategory)
route.post('/category/:categoryId/update-status', categoryController.updateCategoryStatus);


// product management
route.get('/product',auth.isLogin,categoryController.product);
route.get('/add-product',auth.isLogin,categoryController.loadProduct)
route.post('/new-product',auth.isLogin, multerMiddleware.array('images', 3),categoryController.addProduct)
route.get('/edit-product/:productId',auth.isLogin,categoryController.LoadEditProduct);
route.post('/edit-product/:productId',auth.isLogin, multerMiddleware.array('images', 3),categoryController.editProduct);
// route.get('/product/:productId',categoryController.deleteProduct);
route.post('/product/:id/update-status', categoryController.updateProductStatus);



//order management 

route.get('/loadorder',auth.isLogin,orderController.order);
route.post('/update-status/:orderId', auth.isLogin, orderController.updateStatus);
route.post('/confirm-order-cancellation/:orderId',auth.isLogin, orderController.confirmOrderCancellation);
route.get('/canceled-orders',auth.isLogin, orderController.viewCanceledOrders);
route.get('/order-return',auth.isLogin,orderController.viewReturnedOrders);

// coupon management
route.get('/loadcoupon',auth.isLogin,couponController.coupon);
route.get('/add-coupon',auth.isLogin,couponController.LoadaddCoupon);
route.post('/add-coupon',auth.isLogin,couponController.addcoupon);
route.get('/edit-coupon/:couponId', couponController.loadeditCoupon);
route.post('/edit-coupon/:couponId', couponController.editCoupon);
route.get('/loadcoupon/:couponId',couponController.deleteCoupon);
module.exports=route;

