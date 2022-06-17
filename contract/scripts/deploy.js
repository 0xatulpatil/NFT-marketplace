
const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
  

  const nftMarketPlace = await hre.ethers.getContractFactory("nftmarketplace");
  const contract = await nftMarketPlace.deploy();

  await contract.deployed();

  console.log("Contract deployed to:", contract.address);
  const listingPrice = hre.ethers.utils.parseUnits('2',18);
  const royalty = hre.ethers.utils.parseUnits('1',18);

  const metadata1 = "https://ipfs.io/ipfs/QmQVteDmb7qHEhNGqPjyqgQLTxis2Xn2xSy52LL2jCZN2q";
  const metadata2 = "https://ipfs.io/ipfs/QmaPoXkz5PxwvoGxg2obMQq3jtU5bDmZHagLXXcb7BdA8G";
  const metadata3 = "https://ipfs.io/ipfs/QmVtq49yaZjuLJTvjHKibGAFfFERTbgBPoGRQpWHFGJvtP";

  //create tokens
  let mint1 = await contract.mintToken(metadata1,listingPrice,royalty);
  mint1.wait();
  let mint2 = await contract.mintToken(metadata2,listingPrice,royalty);
  mint2.wait();
  let mint3 = await contract.mintToken(metadata3,listingPrice,royalty);
  mint3.wait();

  await contract.mintToken(metadata1,listingPrice,royalty);
  console.log("token minted");
  await contract.mintToken(metadata2,listingPrice,royalty);
  await contract.mintToken(metadata3,listingPrice,royalty);


  
 
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
