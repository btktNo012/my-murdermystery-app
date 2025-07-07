// src/screens/StartScreen.tsx

import React from 'react';
import StyledButton from '../components/StyledButton'; // 共通ボタンをインポート
import './StartScreen.css';

// このコンポーネントが受け取るPropsの型定義
interface StartScreenProps {
  title: string,
  onNext: () => void; // 次の画面（あらすじ画面）へ遷移するための関数
}

const StartScreen: React.FC<StartScreenProps> = ({ title, onNext }) => {
  return (
    <div className="start-container">
      <h1 className="game-title">{title}</h1>
      <StyledButton onClick={onNext} className="start-button">
        START
      </StyledButton>
    </div>
  );
};

export default StartScreen;