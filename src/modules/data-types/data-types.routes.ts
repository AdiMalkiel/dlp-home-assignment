import { Router, type Request } from 'express';
import { StatusCodes } from 'http-status-codes';

import {
  createDataTypeSchema,
  type DataTypeParams,
  dataTypeParamsSchema,
  updateDataTypeSchema,
} from './data-types.schema';
import {
  createDataType,
  deleteDataType,
  getDataTypeById,
  getDataTypes,
  updateDataType,
} from './data-types.service';
import { validateRequestBody } from '../../middleware/validate-request-body';
import { validateRequestParams } from '../../middleware/validate-request-params';

const router = Router();

router.post(
  '/',
  validateRequestBody(createDataTypeSchema),
  async (req, res) => {
    const dataType = await createDataType(req.body);

    res.status(StatusCodes.CREATED).json(dataType);
  },
);

router.get('/', async (_req, res) => {
  const dataTypes = await getDataTypes();

  res.status(StatusCodes.OK).json(dataTypes);
});

router.get(
  '/:id',
  validateRequestParams(dataTypeParamsSchema),
  async (req: Request<DataTypeParams>, res) => {
    const dataType = await getDataTypeById(req.params.id);

    if (!dataType) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Data type not found' });
      return;
    }

    res.status(StatusCodes.OK).json(dataType);
  },
);

router.patch(
  '/:id',
  validateRequestParams(dataTypeParamsSchema),
  validateRequestBody(updateDataTypeSchema),
  async (req: Request<DataTypeParams>, res) => {
    const dataType = await updateDataType(req.params.id, req.body);

    if (!dataType) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Data type not found' });
      return;
    }

    res.status(StatusCodes.OK).json(dataType);
  },
);

router.delete(
  '/:id',
  validateRequestParams(dataTypeParamsSchema),
  async (req: Request<DataTypeParams>, res) => {
    const result = await deleteDataType(req.params.id);

    if (result.numDeletedRows === 0n) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Data type not found' });
      return;
    }

    res.status(StatusCodes.NO_CONTENT).send();
  },
);

export default router;
