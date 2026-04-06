const hre = require("hardhat");
const { ethers } = hre;

async function main() {
    const [deployer, beneficiary] = await ethers.getSigners();

    console.log("Deploying contract with account:", deployer.address);

    const Will = await ethers.getContractFactory("Will");
    const will = await Will.deploy(beneficiary.address, { value: ethers.parseEther("1.0") });

    await will.waitForDeployment();
    console.log("✅ Will contract deployed to:", await will.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
