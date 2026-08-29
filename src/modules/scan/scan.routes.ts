import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import { scan } from './scan.service';
import { scanSchema } from './scan.schema';
import { validateRequestBody } from '../../middleware/validate-request-body';

const router = Router();

router.post('/', validateRequestBody(scanSchema), async (req, res) => {
  const result = await scan(req.body);

  if (!result) {
    res.status(StatusCodes.NOT_FOUND).json({ message: 'Data set not found' });
    return;
  }

  res.status(StatusCodes.OK).json(result);
});

export default router;
