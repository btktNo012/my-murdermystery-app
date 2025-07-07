// src/screens/InfoDisplayScreen.tsx

import React from 'react';
import TextRenderer from '../components/TextRenderer';
import StyledButton from '../components/StyledButton';
import './InfoDisplayScreen.css'; // 共通スタイルをインポート

// この汎用コンポーネントが受け取るPropsの型定義
interface InfoDisplayScreenProps {
  title: string;      // 画面のタイトル (例: "あらすじ", "共通情報")
  filePath: string;   // 表示するテキストファイルのパス
  onNext: () => void; // 次へ進むための関数
}

const InfoDisplayScreen: React.FC<InfoDisplayScreenProps> = ({ title, filePath, onNext }) => {
  return (
    <div className="info-screen-container">
      <h1 className="info-screen-title">{title}</h1>
      <div className="info-screen-content">
        <TextRenderer filePath={filePath} />
      </div>
      <div className="navigation-area">
        <StyledButton onClick={onNext}>
          NEXT
        </StyledButton>
      </div>
    </div>
  );
};

export default InfoDisplayScreen;