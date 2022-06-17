import { ApiStack } from "./ApiStack.js";
import { App } from "@serverless-stack/resources";

/**
 * @param {App} app
 */
export default function (app) {
  app.setDefaultFunctionProps({
    runtime: "nodejs16.x",
    srcPath: "api",
    bundle: {
      format: "esm",
    },
  });

  const storageStack = new StorageStack(app, 'storage');

  const apiStack = new ApiStack(app, 'api', {
    organizationsTable: storageStack.importsTable,
    databaseName: storageStack.databaseName,
    assetsBucket: storageStack.assetsBucket,
  });
  apiStack.addDependency(storageStack);

}
