import React from 'react'
import styles from './NftCard.module.css';

export const NftCard = (props) => {

  const data = props.nftData;
  const clickFunction = props.onClick;
  const btnText = props.btnText;
  const sellUtils = (id) =>{
    const sellP = prompt("Enter your Selling Price");
    console.log(`Selling token ${id} for ${sellP}`);
    clickFunction(id,sellP);
  }
  return (
   <div className={styles.cards}>
    {data.map(item=>{
      return (
        <div className={styles.cardBody} key={item.tokenId}>
          <img alt='nftImage' src={item.imageURL} className={styles.image} />
          <div className={styles.info} key={item.tokenId}>
            <div className={styles.meta}>
              <div className={styles.title}>{item.name}</div>
              <div className={styles.description}>{item.desc}</div>
            </div>
            <div className={styles.price}>{item.price[0]} ETH </div>
          </div>
          
          <button className={styles.buyBtn} 
          onClick={
            props.btnText==="Buy" ? 
            ()=>{clickFunction(item.tokenId,item.price[0])}:
            ()=>{sellUtils(item.tokenId)}
            
            }>{btnText}</button>
          
        </div>
      )
    })}
   </div>    
   
  )
}
