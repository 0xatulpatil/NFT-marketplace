import React from 'react'
import styles from './NftCard.module.css';

export const NftCard = (props) => {

  const data = props.nftData;
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
          <button className={styles.buyBtn} onClick={()=>{alert("sdf")}}>Buy</button>
        </div>
      )
    })}
   </div>    
   
  )
}
