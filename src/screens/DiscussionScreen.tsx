// src/screens/DiscussionScreen.tsx
import React, { useState } from 'react';
import { type Character } from '../types';
import Timer from '../components/Timer';
import Modal from '../components/Modal';
import Tabs, { type TabItem } from '../components/Tabs';
import StyledButton from '../components/StyledButton';
import './DiscussionScreen.css';

interface DiscussionScreenProps {
  title: string;
  character: Character;
  tabItems: TabItem[];
  discussionTime: number;
  onNext: () => void;
}

const DiscussionScreen: React.FC<DiscussionScreenProps> = ({ title, character, tabItems, discussionTime, onNext }) => {
  const [isTicking, setIsTicking] = useState(false);
  const [showStartButton, setShowStartButton] = useState(true);
  const [isTimeUpModalOpen, setIsTimeUpModalOpen] = useState(false);

  const handleStart = () => {
    setIsTicking(true);
    setShowStartButton(false);
  };

  const handlePause = () => {
    setIsTicking(prev => !prev);
  };

  const handleForceEnd = () => {
    setIsTicking(false);
    setIsTimeUpModalOpen(true);
  };
  
  const handleTimeUp = () => {
    if (isTicking) { // 意図せず複数回呼ばれるのを防ぐ
      setIsTicking(false);
      setIsTimeUpModalOpen(true);
    }
  };

  return (
    <div className="discussion-container">
      <h1>{title}</h1>
      <div className="main-content-wrapper">
        {/* --- 左パネル (目的と地図) --- */}
        <div className="left-panel">
          <div className="goals-section">
            <h2 className="goals-title">あなたの目的</h2>
            {character.goals && character.goals.length > 0 ? (
              <ul>
                {character.goals.map((goal, index) => (
                  <li key={index}>{goal.text} ({goal.points}点)</li>
                ))}
              </ul>
            ) : <p>目的はありません。</p>}
          </div>
          <div className="map-section">
            <h2 className="map-title">現場見取り図</h2>
            {character.mapImageFile ? (
              <img src={character.mapImageFile} alt="見取り図" className="map-image" />
            ) : <p>地図はありません。</p>}
          </div>
        </div>

        {/* --- 右パネル (タブ情報) --- */}
        <div className="right-panel">
          <Tabs items={tabItems} />
        </div>
      </div>

      {/* --- 下部コントロールエリア --- */}
      <div className="controls-area">
        <div className="timer-wrapper">
          <Timer 
            initialSeconds={discussionTime}
            isTicking={isTicking}
            onTimeUp={handleTimeUp}
          />
        </div>
        <div className="buttons-wrapper">
          {showStartButton ? (
            <StyledButton onClick={handleStart}>議論開始</StyledButton>
          ) : (
            <>
              <StyledButton onClick={handlePause}>
                {isTicking ? '一時停止' : '再開'}
              </StyledButton>
              <StyledButton onClick={handleForceEnd} style={{backgroundColor: '#f44336'}}>
                議論強制終了
              </StyledButton>
            </>
          )}
        </div>
      </div>
      
      <Modal
        isOpen={isTimeUpModalOpen}
        message="議論が終了しました"
        onConfirm={() => {
          setIsTimeUpModalOpen(false);
          onNext(); // 次の画面へ
        }}
        confirmButtonText="OK"
      />
    </div>
  );
};

export default DiscussionScreen;