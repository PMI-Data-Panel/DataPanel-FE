import React from 'react';
import DashboardCard from '../../components/Card/DashboardCard';
import styles from './AttendanceDashboard.module.css';

const AttendanceDashboard: React.FC = () => {
  return (
    <div className={styles.grid}>
      {/* 1. 전체직원, 근태현황 */}
      <div className={styles.summarySection}>
        <div className={styles.employeeSummary}>
          <div className={styles.summaryItem}>
            <span>전체 설문인원</span>
            <strong>134명</strong>
          </div>
          {/*<div className={styles.summarySubItem}><span>총괄</span> 84명</div>*/}
          {/*<div className={styles.summarySubItem}><span>사내</span> 84명</div>*/}
          {/*<div className={styles.summarySubItem}><span>사외</span> 5명</div>*/}
          {/*<div className={styles.summarySubItem}><span>재택</span> 0명</div>*/}
        </div>
        <DashboardCard title="설문 현황">
          <div className={styles.statusList}>
            <div className={styles.statusItem}><span>미출근</span><strong>30</strong></div>
            <div className={styles.statusItem}><span>지각</span><strong>2</strong></div>
            <div className={styles.statusItem}><span>조퇴</span><strong>7</strong></div>
            <div className={styles.statusItem}><span>휴가</span><strong>7</strong></div>
            <div className={styles.statusItem}><span>휴무</span><strong>0</strong></div>
            <div className={styles.statusItem}><span>연장근무</span><strong>0</strong></div>
          </div>
        </DashboardCard>
      </div>

      {/* 2. 성별현황 */}
      <DashboardCard title="성별현황">
        <div className={styles.chartPlaceholder}>[도넛 차트 영역]</div>
      </DashboardCard>

      {/* 3. 월별 평균근무 시간 추이 */}
      <DashboardCard title="미정">
        <div className={styles.chartPlaceholder}>[라인 차트 영역]</div>
      </DashboardCard>

      {/* 4. 그룹별 연장근무 현황 */}
      <DashboardCard title="미정">
        <table className={styles.dataTable}>
          <thead>
          <tr>
            <th>부서</th><th>월...</th><th>소...</th><th>전...</th><th>소정...</th>
          </tr>
          </thead>
          <tbody>
          {/*<tr><td>SI Dev...</td><td>155.50</td><td>92.00</td><td>63.50</td><td>59.1...</td></tr>*/}
          {/*<tr><td>EMS/U...</td><td>114.50</td><td>68.00</td><td>46.50</td><td>59.3...</td></tr>*/}
          {/*<tr><td>Equip...</td><td>423.50</td><td>293.00</td><td>130.50</td><td>69.1...</td></tr>*/}
          <tr><td>SIC D...</td><td>116.00</td><td>88.00</td><td>28.00</td><td>75.8...</td></tr>
          <tr><td>Produ...</td><td>525.00</td><td>461.50</td><td>63.50</td><td>87.9...</td></tr>
          </tbody>
        </table>
      </DashboardCard>

      {/* 5. 그룹별 평균근무시간 */}
      <DashboardCard title="미정">
        <div className={styles.chartPlaceholder}>[막대 차트 영역]</div>
      </DashboardCard>
    </div>
  );
};

export default AttendanceDashboard;