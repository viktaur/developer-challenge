import { ethers } from "hardhat";

async function main() {
  const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
  const simpleStorage = await SimpleStorage.deploy();
  await simpleStorage.deployed();

  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy();
  await token.deployed();

  const WCUToken = await ethers.getContractFactory("WCUToken");
  const wcuToken = await WCUToken.deploy(5000);
  await wcuToken.deployed();

  console.log("Contracts deployed!\nAdd the addresses to backend/index.ts:");
  console.log(`SIMPLE_STORAGE_ADDRESS: ${simpleStorage.address}`);
  console.log(`TOKEN_ADDRESS: ${token.address}`);
  console.log(`WCU_ADDRESS: ${wcuToken.address}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
