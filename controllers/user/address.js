const Address =require('../../models/addressModel');
const User= require('../../models/userModel')
exports.loadAdreess = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const addresses = await Address.find({ user: userId });
        console.log("Addresses:", addresses);  // Add this line for logging
        res.render('address', { addresses, user_id: userId });
    } catch (error) {
        console.log(error.message);
    }
}


  

exports.loadaddAddress= async(req,res)=>{
    try {
        res.render('addAddress');
    } catch (error) {
        console.log(error.message);
    }
}

exports.addAddress = async (req, res) => {
    try {
        const { name, mobile, address, city, pincode, district, state } = req.body;
        const newAddress = new Address({
            user: req.session.user_id, 
            address: [{
                name,
                mobile,
                address,
                city,
                pincode,
                district,
                state
            }]
        });
        await newAddress.save();
        res.redirect('/address');
    } catch (error) {
        console.log(error.message);
    }
}


exports.loadEditAddress = async (req, res) => {
    try {
        const addressId = req.params.addressId;
        const userAddress = await Address.findById(addressId);
        console.log(userAddress);
        res.render('editAddress', { userAddress });
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
};

exports.updateAddress = async (req, res) => {
    try {
        const addressId = req.params.addressId;
      const { name, mobile, address, city, pincode, district, state } = req.body;
      
      const updatedAddress = {
        name,
        mobile,
        address,
        city,
        pincode,
        district,
        state,
      };
  
      const result = await Address.findByIdAndUpdate(addressId, { $set: { address: [updatedAddress] } }, { new: true });
  
      res.redirect('/address'); 
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Internal Server Error');
    }
  };

  exports.deleteAddress=async (req,res)=>{
    try {
        await Address.findByIdAndDelete(req.params.addressId);
        res.redirect('/address');
    } catch (error) {
        console.log(error.message);
    }
}


exports.chooseAddress = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const addresses = await Address.find({ user: userId });
        console.log("Addresses:", addresses); 
        res.render('choose-address', { addresses, user_id: userId });
    } catch (error) {
        console.log(error.message);
    }
}
exports.SelectedAddress = async (req, res) => {
    try {
      const selectedAddressId = req.body.selectedAddressId;
      const userId = req.session.user_id;
        const user = await User.findByIdAndUpdate(userId, { chosenAddress: selectedAddressId }, { new: true });
  
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      req.session.selectedAddressId = selectedAddressId;
  
      res.redirect('/checkout');
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal Server Error');
    }
  };
  

exports.chooseaddAddress= async(req,res)=>{
    try {
        res.render('chooseaddAdreess');
    } catch (error) {
        console.log(error.message);
    }
}

exports.addnewAddress = async (req, res) => {
    try {
        const { name, mobile, address, city, pincode, district, state } = req.body;
        const newAddress = new Address({
            user: req.session.user_id, 
            address: [{
                name,
                mobile,
                address,
                city,
                pincode,
                district,
                state
            }]
        });
        await newAddress.save();
        res.redirect('/chooseAddress');
    } catch (error) {
        console.log(error.message);
    }
}


exports.loadAddressEdit = async (req, res) => {
    try {
        const addressId = req.params.addressId;
        const userAddress = await Address.findById(addressId);
        console.log(userAddress);
        res.render('editchooseAddress', { userAddress });
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
};


exports.ediAddress = async (req, res) => {
    try {
        const addressId = req.params.addressId;
      const { name, mobile, address, city, pincode, district, state } = req.body;
      
      const updatedAddress = {
        name,
        mobile,
        address,
        city,
        pincode,
        district,
        state,
      };
  
      const result = await Address.findByIdAndUpdate(addressId, { $set: { address: [updatedAddress] } }, { new: true });
  
      res.redirect('/chooseAddress'); 
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Internal Server Error');
    }
  };



  exports.deletechooseAddress=async (req,res)=>{
    try {
        await Address.findByIdAndDelete(req.params.addressId);
        res.redirect('/chooseaddress');
    } catch (error) {
        console.log(error.message);
    }
}



