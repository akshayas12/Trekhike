const Category =require('../../models/categoryModel');
const Product=require('../../models/productModel');
const Order=require('../../models/orderModel');
const User=require('../../models/userModel')

exports.order = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const searchQuery = req.query.search || '';
    const filterStatus = req.query.status || '';
    const statuses = ['Pending', 'processing', 'Shipped', 'Delivered', 'Cancelled'];

    let query = {};
    if (searchQuery) {
      // Search for users by name
      const users = await User.find({ name: { $regex: new RegExp(searchQuery, 'i') } });
      const userIds = users.map(user => user._id);
      query.userId = { $in: userIds };
    }
    if (filterStatus) {
      query.status = filterStatus;
    }

    const order = await Order.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({
        path: 'products.product',
        select: 'productName price',
      })
      .populate('userId');

    const totalOrders = await Order.countDocuments(query);

    // Pass newStatus as null to prevent ReferenceError
    res.render('ordermanagement', {
      order,
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
      searchQuery,
      filterStatus,
      newStatus: null,
      limit,
      statuses
    });
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    res.status(500).send('Internal Server Error');
  }
};



  
  exports.updateStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { newStatus } = req.body;
        console.log('Received parameters:', { orderId, newStatus });
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status: newStatus },
            { new: true }
        );
        const newstatus=newStatus;
        res.redirect('/admin/loadorder');
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
};


exports.confirmOrderCancellation = async (req, res) => {
  const orderId = req.params.orderId;

  try {
    const order = await Order.findById(orderId).populate('products.product');

    // Check if the order is not cancelled yet
    if (order.status !== 'Cancelled') {
      order.products.forEach(async (orderItem) => {
        const product = orderItem.product;
        const quantity = orderItem.quantity;

        // Increase the stock based on the canceled order quantity
        product.stock += quantity;

        // Save the updated product
        await product.save();
      });

      order.status = 'Cancelled';

      await order.save();

      const userId = order.userId;
      if (order.payment === 'onlinePayment') {
        const canceledAmount = order.totalAmount;
        // increment wallet and add transaction to history
        await User.findByIdAndUpdate(userId, { 
          $inc: { wallet: canceledAmount } ,
          $push:{
            walletHistory:{
              type:'credit',
              amount:canceledAmount,
            }
          }
        });
      }
    }

    res.redirect('/admin/canceled-orders'); 
  } catch (error) {
    console.error('Error confirming order cancellation:', error.message);
    res.status(500).send('Internal Server Error');
  }
};

exports.viewCanceledOrders = async (req, res) => {
  try {
    // Fetch all canceled orders
    const canceledOrders = await Order.find({ status: 'Cancellation' }).populate('products.product');

    // Render the view and pass the canceled orders
    res.render('cancel-order', { canceledOrders });
  } catch (error) {
    console.error('Error fetching canceled orders:', error.message);
    res.status(500).send('Internal Server Error');
  }
};


exports.viewReturnedOrders = async (req, res) => {
  try {
    // Fetch all returned orders
    const returnedOrders = await Order.find({ returned: true }).populate('userId').populate('products.product');

    // Render the view and pass the returned orders
    res.render('return-order', { returnedOrders });
  } catch (error) {
    console.error('Error fetching returned orders:', error.message);
    res.status(500).send('Internal Server Error');
  }
};