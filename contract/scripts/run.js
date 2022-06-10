
const hre = require("hardhat");

async function main() {
  

  const Greeter = await hre.ethers.getContractFactory("nftmarketplace");
  const contract = await Greeter.deploy();

  await contract.deployed();

  console.log("Greeter deployed to:", contract.address);
  const listingPrice = hre.ethers.utils.parseUnits('5',18);
  const royalty = hre.ethers.utils.parseUnits('1',18);


  //create tokens
  await contract.mintToken("tokenURI",listingPrice,royalty);
  console.log("token minte");

  //get all the unsold items:
//   let items = await contract.getAllMarketitems();
//   items = await Promise.all(items.map(async i =>{
//     const tokenURI = await contract.tokenURI(i.token)

//     let item = {
//         price: i.price,
//         tokenId: i.tokenId,
//         seller: i.seller,
//         owner: i.owner,
//         tokenURI
//     }
//     return item
//   }))
//   console.log('items:',items)

  let tx1 = contract.getAllMarketitems();
  await tx1;

  tx1.then((item)=>{ 
    console.log(item);
    const tokenUri = await contract.tokenUri(item.tokenId);
    console.log(tokenUri);
  })
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
