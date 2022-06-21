import React,{useState,useEffect} from 'react'
import { ethers } from 'ethers';
import styles from './MyNft.module.css'
import CONTRACT_ABI from '../utils/CONTRACT_ABI.json';

export const MyNft = () => {
    const [nftData, setNftData] = useState([]);
    const CONTRACT_ADDRESS = '0x9F3EC3e71D2A6e5099a0059314D0CB956bE1B717';

    const getMyNfts = async ()=> {
       try{
        const {ethereum} = window;
        if(ethereum){
             const provider = new ethers.providers.Web3Provider(ethereum);
             const signer = provider.getSigner();
             const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI.abi, signer);

             let txn = await contract.fetchMyNfts();
             console.log(txn);

        }
       }catch(err){
        console.log(err);
       }
    }

    useEffect(() => {
        getMyNfts();
    }, []);
  return (
    <div>MyNft</div>
  )
}
