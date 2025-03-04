import { z } from 'zod';

const userIdSchema = z.object({
  id: z.string().uuid('Invalid uuid format'),
});

export default { userIdSchema };
