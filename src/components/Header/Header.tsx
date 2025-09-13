import React from 'react';
import styles from './Header.module.css';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <h3>설문조사 현황</h3>
      </div>
      <div className={styles.rightSection}>
        <input type="date" defaultValue="2022-04-25" className={styles.datePicker} />
        <select className={styles.selectBox}>
          <option>구분</option>
        </select>
        <input type="search" placeholder="Search" className={styles.searchBar} />
        <button className={styles.iconButton}>설정</button>
        <button className={styles.iconButton}>로그아웃</button>
      </div>
    </header>
  );
};

export default Header;
