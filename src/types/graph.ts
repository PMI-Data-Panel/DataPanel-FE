export interface BarData {
  label: string;
  value: number;
  color: string;
  count: number;
  [key: string]: string | number; // 인덱스 시그니처 추가
}
