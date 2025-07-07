// src/screens/CharacterSelectScreen.tsx

import React, { useState } from 'react';
import Modal from '../components/Modal';
import { type Character } from '../types';
import './CharacterSelectScreen.css';

// このコンポーネントが受け取るPropsの型定義
interface CharacterSelectScreenProps {
  // キャラクター情報配列
  characters: Character[];
  // キャラクターが選択された場合の関数（キャラIDを返却）
  onCharacterSelect: (characterId: string) => void;
}

// キャラクター選択画面のコンポーネント
const CharacterSelectScreen: React.FC<CharacterSelectScreenProps> = ({ characters, onCharacterSelect }) => {
  // モーダル表示フラグ(true:表示する、false:表示しない)
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 選択されたキャラクター情報を保持するためのState
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);

  // PC（プレイヤーキャラクター）のみをフィルタリング
  const playerCharacters = characters.filter(char => char.type === 'PC');

  // キャラクターカードがクリックされたときの処理
  const handleCardClick = (character: Character) => {
    // 表示対象のキャラクター情報をselectedCharにセット
    setSelectedChar(character);
    // モーダルを表示
    setIsModalOpen(true);
  };

  // モーダルの「YES」が押されたときの処理
  const handleConfirm = () => {
    if (selectedChar) {
      // App.tsxに選択したキャラIDを通知
      onCharacterSelect(selectedChar.id);
    }
    // ここで isModalOpen = false にしなくても、画面が切り替わるのでモーダルは消えるため不要
  };

  // モーダルの「NO」が押されたときの処理
  const handleClose = () => {
    // モーダルを非表示
    setIsModalOpen(false);
    // キャラ選択の状態をリセット
    setSelectedChar(null);
  };

  return (
    <div className="char-select-container">
      <h1>キャラクターセレクト</h1>
      <p className="char-select-info">
        演じるキャラクターを相談して決めてください。
      </p>
      <ul className="char-list">
        {/* map(配列の各要素に対して指定した関数を実行)を利用して、PC情報をすべて描画 */}
        {playerCharacters.map(char => (
          <li key={char.id} className="char-card" onClick={() => handleCardClick(char)}>
            <h2 className="char-name">{char.name}</h2>
            <p className="char-profile">{char.profile}</p>
          </li>
        ))}
      </ul>

      {/* 確認モーダル */}
      <Modal
        isOpen={isModalOpen}
        message={selectedChar ? `[${selectedChar.name}] このキャラクターでよろしいですか？` : ''}
        onConfirm={handleConfirm}
        onClose={handleClose}
        confirmButtonText="YES"
        closeButtonText="NO"
      />
    </div>
  );
};

export default CharacterSelectScreen;