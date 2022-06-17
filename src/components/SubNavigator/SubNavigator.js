import React, {useState} from 'react';
import styles from './SubNavigator.module.css';

export const SubNavigator = (props) => {
  
  console.log(props.currentSection);
  return (
    <div className={styles.subNav}>
        <div className={styles.nav}>
            <div className={props.currentSection==='marketItems' ? styles.selected:styles.notselected} onClick={()=>props.setSection('marketItems')}>Market Items</div>
            <div className={props.currentSection==="myNfts"? styles.selected:styles.notselected} onClick={()=>props.setSection('myNfts')}>My NFT's</div>
        </div>
    </div>
  )
}
