// src/screens/EndingScreen.tsx

import React from 'react';
import TextRenderer from '../components/TextRenderer';
import StyledButton from '../components/StyledButton';
import { type Ending } from '../types';
import './InfoDisplayScreen.css'; 

interface EndingScreenProps {
  ending: Ending; // App.tsxから対応するエンディングオブジェクトを受け取る
  onNext: () => void;
}

const EndingScreen: React.FC<EndingScreenProps> = ({ ending, onNext }) => {
  return (
    <div className="info-screen-container">
      <h1 className="info-screen-title">{ending.title}</h1>
      <div className="info-screen-content">
        <TextRenderer filePath={ending.endingFile} />
      </div>
      <div className="navigation-area">
        <StyledButton onClick={onNext}>
          END
        </StyledButton>
      </div>
    </div>
  );
};

export default EndingScreen;