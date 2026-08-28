import express from 'express';

import scanRouter from './modules/scan/scan.routes';
import { errorHandler } from './middleware/error-handler';
import dataSetsRouter from './modules/data-sets/data-sets.routes';
import dataTypesRouter from './modules/data-types/data-types.routes';

const app = express();

app.use(express.json());

app.use('/api/datatypes', dataTypesRouter);
app.use('/api/datasets', dataSetsRouter);
app.use('/api/scan', scanRouter);

app.use(errorHandler);

export default app;
