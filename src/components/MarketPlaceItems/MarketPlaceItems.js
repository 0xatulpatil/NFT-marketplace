import React,{useState,useEffect} from 'react';
import { ethers } from 'ethers';
import CONTRACT_ABI from '../utils/CONTRACT_ABI.json';
import styles from './MarketPlaceItems.module.css'



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
                    let item = {
                    price: i.price.toString(),
                    tokenId: i.tokenId.toString(),
                    seller: i.seller,
                    owner:i.owner,
                    royalty:i.royalty.toString(),
                    tokenUr
                    }
                    return item
                    
                }));
                setNftData(tx1);
                console.log(nftData)
            }
        }catch(err){
            console.log(err);
        }
    }
    useEffect(() => {
       getMarketItem();
    }, []);

    return (
    <div>
       <h2>MarketPlaceItems</h2>
       {/* { nftData.length > 0 ? listItems : <>Loading</>} */}
       {/* <div>{nftData}</div> */}

       {nftData.map(item=> {return(
        <div className={styles.card}>
            <div>Token Id:{item.tokenId}</div>
            <div>Price:{item.price}</div>
            <div>Seller:{item.seller}</div>

        </div>
       )})}
    </div>

    )
}
