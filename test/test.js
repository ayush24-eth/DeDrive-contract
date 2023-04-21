const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Drive", async () => {
    const deployContract = async () => {
        const [owner, otherAccount] = await ethers.getSigners();
    
        const Drive = await ethers.getContractFactory("Drive"); // contract instance
        const drive = await Drive.deploy(); // deploy contract
        await drive.deployed();
    
        return { drive, owner, otherAccount };
    };
    
    describe("Deployment", () => {
        it("Contract Deployed", async () => {
            const  { drive }  = await loadFixture(deployContract);

            expect(await drive.name()).to.equal("De Drive");
            expect(await drive.symbol()).to.equal("DD");
        });
    });

    describe("Upload and Fetch Files", () => {
        it("Files uploaded by owner", async () => {
            const { drive } = await loadFixture(deployContract);
            await drive.upload("Ayush", 643, "Qm72jdh7");
            await drive.upload("Raina", 17, "Qmjdh7");
            // console.log(ownerFirstFile);
            const Files = await drive.getAllFiles();
            // console.log(Files);
            
            [, cid, fileName, fileSize] = Files[0];
            // console.log(fileName, fileSize, cid);
            expect(fileName, fileSize, cid).to.equal("Ayush", 643, "Qm72jdh7");

            [,cid, fileName, fileSize] = Files[1];
            expect(fileName, fileSize, cid).to.equal("Raina", 17, "Qmjdh7");


            // expect(firstFile[0].fileName).to.equal("Ayush");
            // expect(firstFile[0].fileSize).to.equal(643);
            // expect(firstFile[0].cid).to.equal("Qm72jdh7");
        });
        it("Files uploaded by otherAccount", async () => {
            const { drive, otherAccount } = await loadFixture(deployContract);
            await drive.connect(otherAccount).upload("Hans", 433, "Qmjdh7hb");
            await drive.connect(otherAccount).upload("Keshav", 323, "Qmjdhvd7hb");
            const Files = await drive.connect(otherAccount).getAllFiles();
            // console.log(Files);
            [, cid, fileName, fileSize] = Files[0];
            expect(fileName, fileSize, cid).to.equal("Hans", 433, "Qmjdh7hb");
            [, cid, fileName, fileSize] = Files[1];
            expect(fileName, fileSize, cid).to.equal("Keshav", 323, "Qmjdhvd7hb");
            
        });
    });

    describe("Delete and Get Updated Files", () => {
        it("File deleted by owner", async () => {
            const { drive } = await loadFixture(deployContract);
            await drive.upload("Ayush", 643, "Qm72jdh7");
            await drive.upload("Raina", 43, "Qmjdh7");
            await drive.terminate(0);
            const Files = await drive.getAllFiles();
            [, cid, fileName, fileSize] = Files[0];
            expect(fileName, fileSize, cid).to.equal("Raina", 43, "Qmjdh7");
        });
        it("File deleted by other Account", async () => {
            const { drive, otherAccount } = await loadFixture(deployContract);
            await drive.connect(otherAccount).upload("Hans", 433, "Qmjdh7hb");
            await drive.connect(otherAccount).upload("Keshav", 323, "Qmjdhvd7hb");
            await drive.connect(otherAccount).terminate(0);
            const Files = await drive.connect(otherAccount).getAllFiles();
            [, cid, fileName, fileSize] = Files[0];
            expect(fileName, fileSize, cid).to.equal("Keshav", 323, "Qmjdhvd7hb");
        });
        it("Delete all Files", async () => {
            const { drive, owner } = await loadFixture(deployContract);
            await drive.upload("Hans", 433, "Qmjdh7hb");
            await drive.upload("Keshav", 323, "Qmjdhvd7hb");
            await drive.terminate(0);
            await drive.terminate(0);
            const Files = await drive.getAllFiles();
            expect(Files).to.deep.equal([]);
            // const size = await drive.addressToLastUsedPosition(owner.address);
            // expect(size).to.equal(0);
        });
    });
});