// Picks the database driver from DB_DRIVER (default: mongodb). To add a database (e.g. MySQL):
//   1. create src/db/drivers/<name>/index.js exporting createDriver(config) (see README.md here),
//   2. register it below,
//   3. run the contract tests against it (test/repository.contract.test.js).
// Drivers are imported lazily, so unused database packages are never loaded.

const drivers = {
  mongodb: () => import("./drivers/mongodb/index.js"),
  memory: () => import("./drivers/memory/index.js"),
};

export const availableDrivers = Object.keys(drivers);

export async function createDatabase(config) {
  const load = drivers[config.db.driver];
  if (!load) {
    throw new Error(`Unknown DB_DRIVER "${config.db.driver}". Available: ${availableDrivers.join(", ")}.`);
  }
  const { createDriver } = await load();
  const driver = createDriver(config);
  await driver.connect();
  return driver;
}
