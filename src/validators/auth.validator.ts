import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters' }),
  deviceType: z.enum(['desktop', 'mobile', 'tablet'], {
    message: 'Invalid device type.',
  }),
  browser: z.string().nonempty({ message: 'Browser is required.' }),
  os: z.string().nonempty({ message: 'OS is required.' }),
});

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
  deviceType: z.enum(['desktop', 'mobile', 'tablet'], {
    message: 'Invalid device type.',
  }),
  browser: z.string().nonempty({ message: 'Browser is required.' }),
  os: z.string().nonempty({ message: 'OS is required.' }),
});

export default { registerSchema, loginSchema };
