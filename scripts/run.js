const hre = require("hardhat");

async function main() {
  const [owner, hans, yash] = await hre.ethers.getSigners();

  const Drive = await hre.ethers.getContractFactory("Drive");
  const drive = await Drive.deploy();

  await drive.deployed();

  console.log(`Drive contract deployed to: ${drive.address}`);
  console.log(`Contract deployed by: ${owner.address}`);

  console.log(`Hans Address: ${hans.address}`);
  console.log(`Yash Address: ${yash.address}`);
  // console.log(drive);

  //Uplading Files

  //Uploading files from the owner address.
  let uploadTxn;
  uploadTxn = await drive.upload("Ayush", 2434, "QmdfTbBqBPQ7VNxZgS1zR1n");
  uploadTxn = await drive.upload("Raina", 3949, "QmdfTiwReogJgS1zR1n");
  await uploadTxn.wait(); // Wait for the transaction to be mined

  //uploading files from hans address
  uploadTxn = await drive.connect(hans).upload("Hans", 2924, "QmdfTbBqBogJgS1zR1n");
  uploadTxn = await drive.connect(hans).upload("Keshav", 2924, "QmdfeogJgS1zR1n");
  await uploadTxn.wait();

  //uloading files from yash address
  uploadTxn = await drive.connect(yash).upload("Yash", 5532, "QmdfTbBqBPQ7VNxZES1zR1n");
  uploadTxn = await drive.connect(yash).upload("Aditya", 8532, "QmdfTbJgS1zR1n");
  await uploadTxn.wait();


  // Getting files
  let allFilesOFUser;

  //getting files of owner
  allFilesOFUser = await drive.getAllFiles();
  console.log(allFilesOFUser);

  //getting files of hans
  allFilesOFUser = await drive.connect(hans).getAllFiles();
  console.log(allFilesOFUser);

  //getting files of yash
  allFilesOFUser = await drive.connect(yash).getAllFiles();
  console.log(allFilesOFUser);


  //Deleting and then Getting Files
  let deleteTxn;

  //deleting 1st file from owner account passing index as a param
  deleteTxn = await drive.terminate(0);
  //files after deleting
  allFilesOFUser = await drive.getAllFiles();
  console.log(allFilesOFUser);

  //deleting 2nd file from hans account passing index as a param
  deleteTxn = await drive.connect(hans).terminate(1);
  //files after deleting
  allFilesOFUser = await drive.connect(hans).getAllFiles();
  console.log(allFilesOFUser);

  //deleting both from yash account passing index as a param
  deleteTxn = await drive.connect(yash).terminate(0);
  deleteTxn = await drive.connect(yash).terminate(0);
  //files after deleting
  allFilesOFUser = await drive.connect(yash).getAllFiles();
  console.log(allFilesOFUser);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
