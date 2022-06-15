import React from 'react';
import styles from './SubNavigator.module.css';

export const SubNavigator = () => {
  return (
    <div className={styles.subNav}>
        <div className={styles.nav}>
            <div className={styles.sec1}>Market Items</div>
            <div className={styles.sec2}>My NFT's</div>
        </div>
    </div>
  )
}
