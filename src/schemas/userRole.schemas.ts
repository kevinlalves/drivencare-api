import { z } from 'zod';

const create = z.object({
  name: z.string().min(2),
});

export default { create };
