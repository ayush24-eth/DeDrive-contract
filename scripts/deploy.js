const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log(`Contract deployed by: ${deployer.address}`);

  const Drive = await hre.ethers.getContractFactory("Drive");
  const drive = await Drive.deploy();
  await drive.deployed();

  console.log(`Drive contract address: ${drive.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
