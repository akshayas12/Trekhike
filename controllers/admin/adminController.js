const User =require('../../models/userModel')
const bcrypt=require('bcrypt')

exports.loadLogin=async(req,res)=>{
    try {
        res.render('adminlogin');
    } catch (error) {
        console.log(error.message);
    }
}
 
exports.verifylogin = async (req, res) => {
  try {
      const { email, password } = req.body;
      if (email && password) {
          const userLogin = await User.findOne({ email: email });
          if (userLogin) {
              const passwordMatch = await bcrypt.compare(password, userLogin.password);
              if (passwordMatch) {
                 if(userLogin.is_admin === 1)
                 {
                  req.session.user_id=userLogin._id;
                  res.redirect('/admin/adminhome');
                 }
                  else{
                      res.render('adminlogin', { message: "Incorrect email or password" });

                  }
              } else {
                  res.render('adminlogin', { message: "Incorrect email or password" });
              }
          } else {
              res.render('adminlogin', { message: "Incorrect email or password..." });
          }
      } else {
          res.render('adminlogin',{ message: "Email and password are required" });
      }
  } catch (error) {
      console.log(error.message);
      // res.status(500).send('Internal Server Error');
  }
}


exports.loadHome = async (req, res) => {
    try {
        res.render('adminhome');
    } catch (error) {
        console.log(error.message);
    }
}

exports.listUser = async (req, res) => {
    try {
        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skipIndex = (page - 1) * limit;

        // Filtering
        const filter = {};
       

        // Search
        const searchQuery = req.query.search;
        if (searchQuery) {
            filter.$or = [
                { name: { $regex: searchQuery, $options: 'i' } },
                { email: { $regex: searchQuery, $options: 'i' } }
            ];
        }

        // Fetch users based on pagination, filtering, and search
        const userData = await User.find(filter)
            .skip(skipIndex)
            .limit(limit);

        // Count total number of users (for pagination)
        const totalCount = await User.countDocuments(filter);

        res.render('userlist', {
            user: userData,
            totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit)
        });
    } catch (error) {
        console.log(error.message);
    }
};
exports.blockUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById({ _id: id });

        if (user.isBlocked === false) {
            await User.findByIdAndUpdate(id, { $set: { isBlocked: true } });
        } else {
            await User.findByIdAndUpdate(id, { $set: { isBlocked: false } });
        }

        
        res.redirect('/admin/listUser');
    } catch (error) {
        console.log(error.message);
    }
};



exports.logout = (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/admin');
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');

    }
}
