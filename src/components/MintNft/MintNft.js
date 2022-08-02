import React, {useState} from 'react'
import styles from './MintNft.module.css'
import {create} from 'ipfs-http-client';
import IPFS from 'ipfs-mini';
import { ethers } from 'ethers';
import { upload } from '@testing-library/user-event/dist/upload';
import CONTRACT_ABI from '../utils/CONTRACT_ABI.json'
import { useEffect } from 'react';

const client = new create('https://ipfs.infura.io:5001/api/v0');
const ipfs = new IPFS({host:'ipfs.infura.io',port:5001,protocol:'https'});
const CONTRACT_ADDRESS = '0x1b23e0251bb4C5ED951bd6Ba94d086d6e142Bfd7';

export const MintNft = (props) => {

    const [name,setName] = useState('');
    const [desc,setDesc] = useState('');
    const [picture,setPicture] = useState(null);
    const [price,setPrice] = useState('');
    const [royalty,setRoyalty] = useState('');
    const [imageHash,setImageHash]=useState('https://bafybeiaeoi66phx7f5gld7bciojh3bc74fa2j6dqjtn4jyzukteg7chtcu.ipfs.infura-ipfs.io/');
    const [tokenURI, setTokenURI] = useState('');


    const uploadPicture = async() =>{
       try{
          const added = await client.add(picture);
          const url = `https://ipfs.infura.io/ipfs/${added.path}`;
          console.log(url);
          setImageHash(url);
       }catch(e){
        console.log(e);
       }
    }

    const uploadURI = async ()=>{
      const data = {
            name:name,
            description:desc,
            image_hash:imageHash
        }
        const json = JSON.stringify(data);
        let uri

        ipfs.add(json, (err,hash)=>{
            if(err){ return console.log(err);}

            uri = `https://ipfs.io/ipfs/${hash}`;
            setTokenURI(uri);
            console.log(uri);
        });
        // setTokenURI(uri);
    }

    const minting = async () =>{
       try{
            const {ethereum} = window;
            if(ethereum){
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI.abi, signer);
                const pric = ethers.utils.parseUnits(price,18);
                const royalt = ethers.utils.parseUnits(royalty,18);

                let txn = async() =>{
                     await contract.mintToken(tokenURI,pric,royalt);
                    console.log(tokenURI);
                }
                console.log(txn());
            }
        }catch(err){
          console.log(err);
          throw err;
        }
    }

   const mint = async()=>{
   uploadURI().then(()=>{
     minting();
   })
   }
   
  return (
    <div className={styles.mainModal}>
    <div>Mint Your own Token</div>
    <p>Name</p>
    <input type="text" name="" id="" onChange={(e)=>{setName(e.target.value)}}/>
    <p>Description</p>
    <input type="text" name="" id="" onChange={(e)=>{setDesc(e.target.value)}}/>
    <p>Image</p>
    <input type="file" accept="image/png, image/jpg, image/gif, image/jpeg"/>    
    <p>Price</p>
    <input type="text" onChange={(e)=>{setPrice(e.target.value)}} />
    <p>Royalty</p>
    <input type="text" onChange={(e)=>{setRoyalty(e.target.value)}}/>
    <button onClick={()=>mint()}>Mint Token</button>
    </div>
  )
}
