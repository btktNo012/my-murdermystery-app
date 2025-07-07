// src/screens/IndividualStoryScreen.tsx
import React from 'react';
import TextRenderer from '../components/TextRenderer';
import StyledButton from '../components/StyledButton';
import { type Character } from '../types';
import './IndividualStoryScreen.css'; // 更新したCSSをインポート

interface IndividualStoryScreenProps {
  character: Character;
  onBack: () => void;
  onNext: () => void;
}

const IndividualStoryScreen: React.FC<IndividualStoryScreenProps> = ({ character, onBack, onNext }) => {
  // character.storyFile が存在しない場合のためのガード
  if (!character.storyFile) {
    return <div>ストーリー情報がありません。</div>;
  }

  return (
    <div className="individual-story-container">
      <h1>個別ストーリー: {character.name}</h1>
      
      {/* メインコンテンツを左右に分割するラッパー */}
      <div className="main-content-wrapper">

        {/* --- 左パネル (ストーリーと目的) --- */}
        <div className="left-panel">
          <div className="story-content-area">
            {/* ストーリー本文 */}
            <TextRenderer filePath={character.storyFile} />

            {/* 目的セクション */}
            {character.goals && character.goals.length > 0 && (
              <div className="goals-section">
                <h2 className="goals-title">あなたの目的</h2>
                <ul className="goals-list">
                  {character.goals.map((goal, index) => (
                    <li key={index} className="goal-item">
                      {goal.text} ({goal.points}点)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* --- 右パネル (地図) --- */}
        <div className="right-panel">
          <h2 className="map-title">現場見取り図</h2>
          {character.mapImageFile ? (
            <img 
              src={character.mapImageFile} 
              alt="現場見取り図" 
              className="map-image"
            />
          ) : (
            <div>地図情報がありません。</div>
          )}
        </div>

      </div>

      {/* ナビゲーションボタン */}
      <div className="navigation-area">
        <StyledButton onClick={onBack}>
          BACK
        </StyledButton>
        <StyledButton onClick={onNext}>
          NEXT
        </StyledButton>
      </div>
    </div>
  );
};

export default IndividualStoryScreen;