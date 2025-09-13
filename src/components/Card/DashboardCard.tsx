import React from 'react';
import styles from './DashboardCard.module.css';

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, children }) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h4 className={styles.cardTitle}>{title}</h4>
        <div className={styles.cardActions}>
          <span>⚙️</span>
          <span>❌</span>
        </div>
      </div>
      <div className={styles.cardBody}>{children}</div>
    </div>
  );
};

export default DashboardCard;
