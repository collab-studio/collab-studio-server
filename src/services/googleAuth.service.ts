const User = require('../models/User');

const authenticateGoogleUser = async (profile) => {
  let user = await User.findOne({ googleId: profile.id });

  if (!user) {
    user = new User({
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
      provider: 'google',
    });
    await user.save();
  }

  return user;
};

module.exports = { authenticateGoogleUser };
