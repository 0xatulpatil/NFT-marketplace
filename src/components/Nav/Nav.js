import React from 'react';
import styles from './Nav.module.css';

export const Nav = (props) => {
  return (
    <div className={styles.navContainer}>

     <div className={styles.container}>
        <div className={styles.navlogo}>NFT-Market</div>
        <div className={styles.navaddress}>{props.address}</div>
     </div>
    </div>
  )
}
