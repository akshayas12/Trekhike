const User = require('../../models/userModel');
const Order = require('../../models/orderModel');
const Product=require('../../models/productModel')

const puppeteer = require('puppeteer');
const { order } = require('./orderController');

async function generatePDF() {
    // Launch a new browser instance
    const browser = await puppeteer.launch();

    // Create a new page
    const page = await browser.newPage();

    // Go to the dashboard page
   
    await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle0' });

    // Generate the PDF from the page content
    const pdf = await page.pdf({ format: 'A4' });

    // Close the browser
    await browser.close();

    return pdf;
}


const getTotalRevenue = async () => {
    try {
      const orders = await Order.find({
        $or: [
          { payment: 'onlinePayment' }, // Only consider orders with online payment
          { $and: [ 
            { payment: 'COD' },
            { status: 'Delivered' },
            { returned: { $ne: true } },
            { 'cancellation.isCancelled': { $ne: true } }
          ]}
        ]
      });
  
      // Calculate total revenue
      let totalRevenue = 0;
      orders.forEach(order => {
        totalRevenue += order.totalAmount;
      });
  
      return totalRevenue;
    } catch (error) {
      console.error('Error calculating total revenue:', error);
      return null;
    }
  };
  

exports.getDashboardData = async (req, res) => {
    try {
        // Fetch total users count
        const totalUsers = await User.countDocuments();

        // Fetch total orders count
        const totalOrders = await Order.countDocuments();

        const cancelledOrders = await Order.countDocuments({ status: 'Cancelled' });

        const totalproduct= await Product.countDocuments();

        const totalRevenue = await getTotalRevenue();

        
      
      
        res.render('adminhome', { totalUsers, totalOrders, cancelledOrders,totalproduct,totalRevenue});
    } catch (error) {
        console.error('Error fetching dashboard data:', error.message);
        res.status(500).send('Internal Server Error');
    }
};



exports.dashboardData = async (req, res) => {
  try {
      // Fetch the data for each period
      const weeklyData = await User.aggregate([
          { 
              $group: {
                  _id: { $week: "$createdAt" },
                  count: { $sum: 1 }
              }
          },
          { $sort: { "_id": 1 } }
      ]);

      const monthlyData = await User.aggregate([
          { 
              $group: {
                  _id: { $month: "$createdAt" },
                  count: { $sum: 1 }
              }
          },
          { $sort: { "_id": 1 } }
      ]);

      const yearlyData = await User.aggregate([
          { 
              $group: {
                  _id: { $year: "$createdAt" },
                  count: { $sum: 1 }
              }
          },
          { $sort: { "_id": 1 } }
      ]);

      // Prepare data for the chart
      const labels = weeklyData.map(entry => entry._id); // Assuming the labels are the same for all periods
      const weeklyCounts = weeklyData.map(entry => entry.count);
      const monthlyCounts = monthlyData.map(entry => entry.count);
      const yearlyCounts = yearlyData.map(entry => entry.count);

      res.json({ labels, weeklyData: weeklyCounts, monthlyData: monthlyCounts, yearlyData: yearlyCounts });
  } catch (error) {
      console.error('Error fetching dashboard data:', error);
      res.status(500).send('Internal Server Error');
  }
};


exports.orderData = async (req, res) => {
  try {
    const orderData = await Order.aggregate([
      { 
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const labels = orderData.map(entry => entry._id);
    const counts = orderData.map(entry => entry.count);
    res.json({ labels, data: counts });
  } catch (error) {
    console.error('Error fetching order data:', error);
    res.status(500).send('Internal Server Error');
  }
};
exports.salesReport= async (req, res) => {
  try {
      const orders = await Order.find({ status: 'delivered' });
      res.json(orders);
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
}






async function generatePDF() {
    // Launch a new browser instance
    const browser = await puppeteer.launch();

    // Create a new page
    const page = await browser.newPage();

    
    await page.goto('https://www.akshays.xyz/admin/getUserDetailsAndOrders', { waitUntil: 'networkidle0' });

    // Generate the PDF from the page content
    const pdf = await page.pdf({ format: 'A4' });

    // Close the browser
    await browser.close();

    return pdf;
}


exports.downloadSalesReport=async (req, res) => {
  try {
      const pdf = await generatePDF();
      res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdf.length });
      res.send(pdf);
  } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while generating the PDF.');
  }
}



exports.getUserDetailsAndOrders = async (req, res) => {
  try {
    // Aggregate user logins by month with month names
    const monthlyLogins = await User.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          monthName: { $first: { $dateToString: { format: "%B", date: "$createdAt" } } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Generate data for all months, filling in missing months with count 0
    const allMonths = Array.from({ length: 12 }, (_, index) => {
      const month = index + 1;
      const monthName = new Date(2000, month - 1, 1).toLocaleString('en-US', { month: 'long' });
      return { _id: month, monthName, count: 0 };
    });

    // Merge the aggregated data with the generated data to ensure all months are represented
    const mergedData = allMonths.map(month => {
      const match = monthlyLogins.find(entry => entry._id === month._id);
      return match || month;
    });

    // Fetch most selling product details
    const mostSellingProduct = await Order.aggregate([
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.product",
          totalQuantitySold: { $sum: "$products.quantity" }
        }
      },
      { $sort: { totalQuantitySold: -1 } },
      { $limit: 1 }
    ]);

    const mostSellingProductDetails = await Product.findById(mostSellingProduct[0]._id);

    // Fetch delivered orders
    const deliveredOrders = await Order.find({ status: 'delivered' })
    .populate('userId', 'name') // Populate user details
    .populate('products.product', 'productName quantity price'); // Populate product details

    // Count total pending orders
    const pendingOrdersCount = await Order.countDocuments({ status: 'Pending' });
    const returnOrderCount = await Order.countDocuments({ status: 'Returned' });
    const blockUser = await User.countDocuments({ isBlocked: 'true' });
    const onlinePayment = await Order.countDocuments({ payment: 'onlinePayment' });

    // Count total users, total orders, total cancelled orders, total products, and total revenue
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const cancelledOrders = await Order.countDocuments({ status: 'Cancelled' });
    const totalProduct = await Product.countDocuments();
    const totalRevenue = await getTotalRevenue();

    // Render the sales report template with the fetched data
    res.render('sales-report', {
      totalUsers,
      totalOrders,
      cancelledOrders,
      blockUser,
      totalProduct,
      totalRevenue,
      mergedData,
      deliveredOrders,
      mostSellingProduct: mostSellingProductDetails,
      returnOrderCount,
      onlinePayment,
      pendingOrdersCount,
    });
  } catch (error) {
    console.error('Error fetching user details and orders:', error.message);
    res.status(500).send('Internal Server Error');
  }
};


exports.getYearlyRevenue = async (req, res) => {
  try {
    // Fetch yearly revenue data
    const yearlyRevenue = await Order.aggregate([
      {
        $match: {
          status: 'delivered' 
        }
      },
      {
        $group: {
          _id: { $year: '$createdAt' }, // Group by year
          totalRevenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { _id: 1 } } // Sort by year
    ]);

    // Extract years and revenue data for chart rendering
    const years = yearlyRevenue.map(entry => entry._id);
    const revenueData = yearlyRevenue.map(entry => entry.totalRevenue);
console.log("years",years,"revenueData",revenueData);
    // Send the yearly revenue data as JSON
    res.json({ years, revenueData });
  } catch (error) {
    console.error('Error fetching yearly revenue:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


