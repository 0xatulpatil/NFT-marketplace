import React, {useState} from 'react';
import styles from './Nav.module.css';

export const Nav = (props) => {
  const [marketItems, setMarketItems] = useState([]);

  return (
    <div className={styles.navContainer}>

     <div className={styles.container}>
        <div className={styles.navlogo}>NFT-Market</div>
        <div className={styles.navaddress}>{props.currentAccount}</div>
     </div>
    </div>
  )
}
