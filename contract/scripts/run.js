
const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
  

  const Greeter = await hre.ethers.getContractFactory("nftmarketplace");
  const contract = await Greeter.deploy();

  await contract.deployed();

  console.log("Greeter deployed to:", contract.address);
  const listingPrice = hre.ethers.utils.parseUnits('2',18);
  const royalty = hre.ethers.utils.parseUnits('1',18);


  //create tokens
  await contract.mintToken("token1",listingPrice,royalty);
  console.log("token minted");
  await contract.mintToken("token2",listingPrice,royalty);
  await contract.mintToken("token3",listingPrice,royalty);

  const [owner,buyerAddress] = await ethers.getSigners();
  
  await contract.connect(buyerAddress).buyFromMarketitems(1, {value:listingPrice});
  console.log('💰: Item bought');
  // let ownerBalance = await hre.balanceOf(owner.address)
  // let buyerBalance  = await hre.balanceOf(buyerAddress.address);

  // console.log('💵: Owner balance :', ownerBalance);
  // console.log('💵: Buyer balance :', buyerBalance);


 
  let tx1 = await contract.getAllMarketitems()
  tx1 = await Promise.all(tx1.map(async i =>{
    const tokenUr = await contract.tokenURI(i.tokenId);
    let item = {
      price: i.price.toString(),
      tokenId: i.tokenId.toString(),
      seller: i.seller,
      owner:i.owner,
      royalty:i.royalty.toString(),
      tokenUr
    }
    return item
  }))
  console.log('Listed Items from MarketPlace',tx1);

}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
