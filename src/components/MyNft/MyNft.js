import React,{useState,useEffect} from 'react'
import { ethers } from 'ethers';
import styles from './MyNft.module.css'
import CONTRACT_ABI from '../utils/CONTRACT_ABI.json';
import { NftCard } from '../NftCard/NftCard';

export const MyNft = () => {
    const [nftData, setNftData] = useState([]);
    const CONTRACT_ADDRESS = '0x1b23e0251bb4C5ED951bd6Ba94d086d6e142Bfd7';

    const getMyNfts = async ()=> {
       try{
        const {ethereum} = window;
        if(ethereum){
             const provider = new ethers.providers.Web3Provider(ethereum);
             const signer = provider.getSigner();
             const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI.abi, signer);

             let txn = await contract.fetchMyNfts();
             txn = await Promise.all(txn.map(async i =>{
              const tokenUr = await contract.tokenURI(i.tokenId);
              const metaData = await fetch(tokenUr);
              const metaDataJson = await metaData.json();

              let item = {
                name:metaDataJson.name,
                desc:metaDataJson.description,
                price: i.price.toString(),
                tokenId: i.tokenId.toString(),
                seller: i.seller,
                owner:i.owner,
                royalty:i.royalty.toString(),
                tokenUr,
                imageURL:metaDataJson.image_hash
              }
              return item
             }));

             setNftData(txn);

        }
       }catch(err){
        console.log(err);
       }
    }

    const sellNft = async (tokenId,eth) =>{
      try{
        const {ethereum} = window;
        if(ethereum){
             const provider = new ethers.providers.Web3Provider(ethereum);
             const signer = provider.getSigner();
             const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI.abi, signer);
             
             const sellingPrice = ethers.utils.parseUnits(eth,18);
             const txn = await contract.resellToken(tokenId,sellingPrice);
             txn();
             console.log("Nft listed");
        }
      }catch(err){
        console.log(err);
      }
    }
    useEffect(() => {
        getMyNfts();
    }, []);
  return (
    <div className={styles.mainDiv}>
    <div className={styles.mainHeading}>MyNft</div>
    <NftCard nftData={nftData} onClick={sellNft} btnText={"Sell"}/>
    </div>
  )
}
