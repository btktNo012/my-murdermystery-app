// src/screens/VotingScreen.tsx

import React, { useState, useMemo } from 'react';
import { type Character } from '../types';
import Modal from '../components/Modal';
import StyledButton from '../components/StyledButton';
import './VotingScreen.css';

interface VotingScreenProps {
  characters: Character[];
  onVoteComplete: (votedCharacterId: string) => void;
}

const VotingScreen: React.FC<VotingScreenProps> = ({ characters, onVoteComplete }) => {
  const votableCharacters = useMemo(() => 
    // slice()で元の配列をコピーしてからソートする
    characters.slice().sort((a, b) => {
      if (a.type === b.type) return 0;
      if (a.type === 'PC') return -1;
      if (b.type === 'PC') return 1;
      return 0;
    }), 
    [characters]
  );
  
  // 選択されたキャラクターIDを管理するState
  // 初期値としてリストの最初のキャラクターを設定
  const [votedId, setVotedId] = useState<string>(votableCharacters[0]?.id || '');
  
  // モーダルの表示状態
  const [isModalOpen, setIsModalOpen] = useState(false);

  // OKボタンがクリックされたときの処理
  const handleOkClick = () => {
    // 誰かが選択されていなければ何もしない
    if (!votedId) {
      alert('犯人だと思う人物を選択してください。');
      return;
    }
    setIsModalOpen(true);
  };

  // モーダルのYESボタンが押されたときの処理
  const handleConfirm = () => {
    onVoteComplete(votedId);
  };

  // セレクトボックスで選択された人物の名前を取得
  const getSelectedCharacterName = () => {
    return characters.find(char => char.id === votedId)?.name || '';
  };

  return (
    <div className="voting-container">
      <h1>推理結果入力</h1>
      <p className="voting-info">
        それぞれの推理を披露した後、この事件の犯人だと思う人物の投票をしてください<br />
        （自殺の場合は被害者に投票してください）<br />
        投票結果が同数になった場合は追加で話し合いを行い、最多投票者が決まるまで再投票してください
        投票の結果、決定した犯人を選択してください
      </p>

      <div className="voting-form">
        <select 
          className="voting-select"
          value={votedId}
          onChange={(e) => setVotedId(e.target.value)}
        >
          <option value="" disabled>-- 犯人を選択 --</option>
          {votableCharacters.map(char => (
            <option key={char.id} value={char.id}>
              {char.name}
            </option>
          ))}
        </select>
        <StyledButton onClick={handleOkClick}>OK</StyledButton>
      </div>

      <Modal
        isOpen={isModalOpen}
        message={`[${getSelectedCharacterName()}] が犯人となりました。エンディングに入りますか？`}
        onConfirm={handleConfirm}
        onClose={() => setIsModalOpen(false)}
        confirmButtonText="YES"
        closeButtonText="NO"
      />
    </div>
  );
};

export default VotingScreen;