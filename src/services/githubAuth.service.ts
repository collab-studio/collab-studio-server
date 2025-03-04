const User = require('../models/User');

const authenticateGitHubUser = async (profile) => {
  let user = await User.findOne({ githubId: profile.id });

  if (!user) {
    user = new User({
      githubId: profile.id,
      name: profile.displayName || profile.username,
      email: profile.emails?.[0]?.value,
      provider: 'github',
    });
    await user.save();
  }

  return user;
};

module.exports = { authenticateGitHubUser };
