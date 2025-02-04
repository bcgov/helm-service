import * as fs from "fs";
import jsYaml from "js-yaml";

const fs_promises = fs.promises;
const destination_repo = process.env.DESTINATION_REPO|| "quickstart-openshift";
const sourceDirectory = ".";
const main = async () => {
  const chartYaml = await fs_promises.readFile("./helm-service/charts/component/Chart.yaml");
  const destChartYaml = await fs_promises.readFile(`./${destination_repo}/charts/app/Chart.yaml`);
  const chartYamlToJSON =jsYaml.load(chartYaml);
  const version = chartYamlToJSON.version;
  const destChartYamlToJSON =jsYaml.load(destChartYaml);
  const dependencies = destChartYamlToJSON.dependencies;
  let newDependencies = [];
  for(const element of dependencies){
    if(element.name === 'component' && element.repository === 'https://bcgov.github.io/helm-service'){
      element.version = version;
      element.repository = `file://../../../helm-service/charts/component`;
    }
    newDependencies.push(element);
  }
  destChartYamlToJSON.dependencies = newDependencies;
  const newDestChartYaml = jsYaml.dump(destChartYamlToJSON);
  await fs_promises.writeFile(`./${destination_repo}/charts/app/Chart.yaml`, newDestChartYaml);
}
await main();
