import React,{useState,useEffect} from 'react';
import { ethers } from 'ethers';
import CONTRACT_ABI from '../utils/CONTRACT_ABI.json';
import styles from './MarketPlaceItems.module.css';
import { NftCard } from '../NftCard/NftCard';




export const MarketPlaceItems = () => {
    const [nftData, setNftData] = useState([]);


    const CONTRACT_ADDRESS = '0xE4b758E75342440514ddE22c1Fb300F03462ED31';

    const BuyNft = async(token,eth) =>{

      try{
          const {ethereum} = window;
          if(ethereum){
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI.abi, signer);
            const ehtPrice = ethers.utils.parseUnits(eth,18);
            
            let txn = async (token,eth) => {
                let buy = await contract.buyFromMarketitems(token,{value:ehtPrice});
                console.log(buy);
            }
            txn(token);
            

          }
      }catch(err){
        console.log(err);
      }

    }

    const getMarketItem = async()=>{
        try{
            const {ethereum} = window;
            if(ethereum){
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI.abi, signer);
 
                let tx1 = await contract.getAllMarketitems()
                tx1 = await Promise.all(tx1.map(async i =>{
                    const tokenUr = await contract.tokenURI(i.tokenId);
                    const metaData = await fetch(tokenUr);
                    let metaDataJson = await metaData.json();
                    let item = {
                    name:metaDataJson.name || 'abc',
                    desc:metaDataJson.description,
                    price: i.price.toString(),
                    tokenId: i.tokenId.toString(),
                    seller: i.seller,
                    owner:i.owner,
                    royalty:i.royalty.toString(),
                    tokenUr,
                    imageURL:metaDataJson.image_hash
                    }
                    return item;
                    
                }));
                setNftData(tx1);
                
            }
            
        }catch(err){
            console.log(err);
        }
    }

    useEffect(() => {
       getMarketItem();
    }, []);

    return (
    <div className={styles.mainDiv}>
       <h2>MarketPlaceItems</h2>
       <NftCard nftData={nftData} onClick={BuyNft} btnText={"Buy"}/>
    </div>

    )
}
