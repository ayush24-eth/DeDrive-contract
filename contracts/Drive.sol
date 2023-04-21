// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;
import "hardhat/console.sol";

contract Drive {
    string public name = "De Drive";
    string public symbol = "DD";

    struct File {
        address owner; //public address of user
        string cid; //Content Identifier from ipfs
        string fileName; //File name
        uint fileSize; //in KB
        uint timestamp; //time at which file was uploaded
    }

    constructor() {
        // console.log("contract deployed");
    }

    mapping (address => File[]) public files;
    mapping (address => uint256) public addressToLastUsedPosition;

    event uploaded(string cid, string fileName, uint timestamp);
    event deleted(uint index);

    function upload(string memory _fileName, uint _fileSize, string memory _cid) public {
        require(_fileSize>1, "File size should be more than 1KB");

        File memory tempFile;
        tempFile.fileName = _fileName;
        tempFile.fileSize = _fileSize;
        tempFile.timestamp = block.timestamp;
        tempFile.owner = msg.sender;
        tempFile.cid = _cid;

        ++addressToLastUsedPosition[msg.sender];
        // console.log("Total number of files %s", size); //

        files[msg.sender].push(tempFile);
        
        emit uploaded(tempFile.cid, _fileName, tempFile.timestamp);
    }

    function terminate(uint _index) public {
        uint length = addressToLastUsedPosition[msg.sender];
        require(_index < length, "Index out of bound");
        // console.log(length);

        File[] storage temp = files[msg.sender];
        // console.log("temp created");

        for (uint i = _index; i < length-1; i++) {
            temp[i] = temp[i + 1];
        }
        // console.log("copied to temp");
        delete temp[length - 1];
        temp.pop();

        --addressToLastUsedPosition[msg.sender];
        // console.log("Total number of files after deletion %s", size); //

        files[msg.sender] = temp;

        emit deleted(_index);
    }

    function getAllFiles() public view returns(File[] memory) {
        return files[msg.sender];
    }
}