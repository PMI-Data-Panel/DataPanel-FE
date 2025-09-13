import React from 'react';
import styles from './Sidebar.module.css';

const Sidebar: React.FC = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>운영관리</div>
      <nav className={styles.nav}>
        <ul>
          <li><span>설문조사 제작</span></li>
          <li className={styles.active}><span>설문관리</span></li>
          <li><span>데이터 삽입</span></li>
          <li><span>데이터 관리</span></li>
        </ul>
      </nav>
      <div className={styles.orgChart}>
        <h4 className={styles.orgTitle}>조직도(전체)</h4>
        <ul className={styles.orgList}>
          <li>CEO</li>
          <li>Research&Tech. Dev.</li>
          <li>Operation</li>
          <li>Sales&Marketing</li>
          <li>Business Management</li>
          <li className={styles.orgGroup}>
            SI Device
            <ul>
              <li>SIC Device</li>
              <li>SJ MOSFET</li>
              <li>MV MOSFET</li>
            </ul>
          </li>
          {/* ... more items */}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;