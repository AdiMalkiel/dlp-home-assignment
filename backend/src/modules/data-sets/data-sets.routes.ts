import { Router, type Request } from 'express';
import { StatusCodes } from 'http-status-codes';

import {
  createDataSetSchema,
  dataSetParamsSchema,
  type DataSetParams,
  updateDataSetSchema,
} from './data-sets.schema';
import {
  createDataSet,
  deleteDataSet,
  getDataSetById,
  getDataSets,
  updateDataSet,
} from './data-sets.service';
import { validateRequestBody } from '../../middleware/validate-request-body';
import { validateRequestParams } from '../../middleware/validate-request-params';

const router = Router();

router.post('/', validateRequestBody(createDataSetSchema), async (req, res) => {
  const dataSet = await createDataSet(req.body);

  res.status(StatusCodes.CREATED).json(dataSet);
});

router.get('/', async (_req, res) => {
  const dataSets = await getDataSets();

  res.status(StatusCodes.OK).json(dataSets);
});

router.get(
  '/:id',
  validateRequestParams(dataSetParamsSchema),
  async (req: Request<DataSetParams>, res) => {
    const dataSet = await getDataSetById(req.params.id);

    if (!dataSet) {
      res.status(StatusCodes.NOT_FOUND).json({ message: 'Data set not found' });
      return;
    }

    res.status(StatusCodes.OK).json(dataSet);
  },
);

router.patch(
  '/:id',
  validateRequestParams(dataSetParamsSchema),
  validateRequestBody(updateDataSetSchema),
  async (req: Request<DataSetParams>, res) => {
    const dataSet = await updateDataSet(req.params.id, req.body);

    if (!dataSet) {
      res.status(StatusCodes.NOT_FOUND).json({ message: 'Data set not found' });
      return;
    }

    res.status(StatusCodes.OK).json(dataSet);
  },
);

router.delete(
  '/:id',
  validateRequestParams(dataSetParamsSchema),
  async (req: Request<DataSetParams>, res) => {
    const result = await deleteDataSet(req.params.id);

    if (result.numDeletedRows === 0n) {
      res.status(StatusCodes.NOT_FOUND).json({ message: 'Data set not found' });
      return;
    }

    res.status(StatusCodes.NO_CONTENT).send();
  },
);

export default router;
