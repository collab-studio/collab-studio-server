import User from '../models/user.model';

const getUserById = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    return null;
  }
};

export default { getUserById };
