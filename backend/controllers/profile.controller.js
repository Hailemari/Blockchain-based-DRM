const user = require("../models/userModel");
const { s3, getPic } = require("../services/aws-s3/index");

const getUserProfile = async (req, res) => {
  const userId = req.user._id;

  try {
    const imageParams = {
      Bucket: "drmuser-profile",
      Key: `pic/${userId}`,
    };

    let imageChanged = false;
    let newProfilePic = undefined;
    const image = await getPic(imageParams);
    if (image) {
      imageChanged = true;
    }
    if (imageChanged) {
      newProfilePic = `https://drmuser-profile.s3.eu-north-1.amazonaws.com/pic/${userId}`;
    }

    const userRes = await user.findById({ _id: userId }, { password: 0 });
    if (!userRes) {
      return res.status(403).send({
        status: false,
        message: "User profile not exist",
      });
    }

    res.status(200).send({
      status: true,
      message: "User profile",
      data: {
        user: {
          ...userRes._doc,
          newProfilePic: newProfilePic,
        },
        
      },
    });
  } catch (error) {
  
    res.status(400).send(error);
  }
};

const saveProfilePic = async (req, res) => {
  try {
    const { userId } = req.query;
    const picParams = {
      Bucket: "drmuser-profile",
      Key: `pic/${userId}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: "public-read",
    };
    console.log(`Uploading to bucket : ${picParams.Bucket}, Key : ${picParams.Key}`);

    const uploadedFile = await s3.upload(picParams).promise();
    const pictureUrl = uploadedFile.Location;

    console.log(pictureUrl);

    res.status(200).send({
      status: true,
      message: "Profile pic saved",
      data: pictureUrl,
    });
    userRes = await user.findByIdAndUpdate(userId, { profile_pic: pictureUrl },{new : true})
  } catch (error) {
    console.log(error)
    res.status(400).send({
      status: false,
      message: "Failed to save profile pic",
      error: error.message,
    });
  }
};

const updateUserProfile = async (req, res) => {
  // const email = req.user.;
  const { firstName, lastName, email,userType } = req.body;
  try {
    const userRes = await user.findOne({ email: email });
    if (!userRes) {
      return res.status(403).send({
        status: false,
        message: "User profile not exist",
      });
    }

    if (firstName) {
      userRes.firstName = firstName;
    }
    if (lastName) {
      userRes.lastName = lastName;
    }
    if (email) {
      userRes.email = email;
    }
    if (userType) {
      userRes.userType = userType;
    }

    await userRes.save();
    res.status(200).send({
      status: true,
      message: "User profile updated successfully",
      data: userRes,
    });
  } catch (error) {
    logger.info(error);
    res.status(400).send(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  saveProfilePic,
};