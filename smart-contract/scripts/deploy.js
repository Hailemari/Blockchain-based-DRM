const hre = require("hardhat");

async function main() {

  const content = await hre.ethers.deployContract("ContentPlatform");

  await content.waitForDeployment();

  console.log(
    `content deployed to ${content.target}`
  );
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
