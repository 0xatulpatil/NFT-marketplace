import React,{useState,useEffect} from 'react';
import { ethers } from 'ethers';
import CONTRACT_ABI from '../utils/CONTRACT_ABI.json';
import styles from './MarketPlaceItems.module.css';
import { NftCard } from '../NftCard/NftCard';



export const MarketPlaceItems = () => {
    const [nftData, setNftData] = useState([]);


    const CONTRACT_ADDRESS = '0x9F3EC3e71D2A6e5099a0059314D0CB956bE1B717';

    const listItems = () =>{
        nftData.map(nftItem => {
            return(
            <div>
            {/* {()=>{
                fetch(nftItem.token)
            }} */}
            <div>Token ID: {nftItem.tokenId}</div>
            <div>Seller: {nftItem.seller}</div>
            <div>Seller: {nftItem.tokenUr}</div>
            </div>
            )
        })
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
                    const metaDataJson = await metaData.json();
                    // console.log(imageUrl.image_hash);
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
       <NftCard nftData={nftData}/>
    </div>

    )
}
