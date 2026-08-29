import { db } from '../src/db/database';

const seed = async () => {
  await db.transaction().execute(async (trx) => {
    const dataTypes = await trx
      .insertInto('data_types')
      .values([
        {
          name: 'Credit Card',
          description: 'Detects credit card related keywords',
          type: 'keywords',
          content: ['visa', 'mastercard', 'amex'],
          threshold: 1,
        },
        {
          name: 'Personal Information',
          description: 'Detects sensitive personal information',
          type: 'keywords',
          content: ['passport', 'ssn', 'social security'],
          threshold: 1,
        },
        {
          name: 'Confidential',
          description: 'Detects confidential content',
          type: 'keywords',
          content: ['confidential', 'internal', 'secret'],
          threshold: 2,
        },
      ])
      .returningAll()
      .execute();

    const creditCard = dataTypes.find(
      (dataType) => dataType.name === 'Credit Card',
    )!;
    const personalInformation = dataTypes.find(
      (dataType) => dataType.name === 'Personal Information',
    )!;
    const confidential = dataTypes.find(
      (dataType) => dataType.name === 'Confidential',
    )!;

    const dataSets = await trx
      .insertInto('data_sets')
      .values([
        {
          name: 'PCI DSS Policy',
        },
        {
          name: 'Sensitive Information Policy',
        },
      ])
      .returningAll()
      .execute();

    const pciPolicy = dataSets.find(
      (dataSet) => dataSet.name === 'PCI DSS Policy',
    )!;
    const sensitivePolicy = dataSets.find(
      (dataSet) => dataSet.name === 'Sensitive Information Policy',
    )!;

    await trx
      .insertInto('data_set_data_types')
      .values([
        {
          data_set_id: pciPolicy.id,
          data_type_id: creditCard.id,
        },
        {
          data_set_id: sensitivePolicy.id,
          data_type_id: creditCard.id,
        },
        {
          data_set_id: sensitivePolicy.id,
          data_type_id: personalInformation.id,
        },
        {
          data_set_id: sensitivePolicy.id,
          data_type_id: confidential.id,
        },
      ])
      .execute();
  });
};

seed()
  .then(() => {
    console.log('Database seeded successfully');
  })
  .catch((error) => {
    console.error('Failed to seed database:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.destroy();
  });
