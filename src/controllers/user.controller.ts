import { Request, Response } from 'express';
import userService from '../services/user.service';

const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await userService.getUserById(userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default { getUserById };
