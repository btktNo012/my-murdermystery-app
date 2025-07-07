// src/components/Modal.tsx
import React from 'react';
import './Modal.css'; // 先ほど作成したCSSをインポート

// モーダルが受け取るPropsの型定義
interface ModalProps {
  isOpen: boolean;            // モーダルが表示されているか
  message: string;            // 表示するメッセージ
  onClose?: () => void;       // NOボタンや背景クリック時の動作（オプション）
  onConfirm?: () => void;     // YES/OKボタンクリック時の動作（オプション）
  closeButtonText?: string;   // NOボタンのテキスト（デフォルトは'NO'）
  confirmButtonText?: string; // YES/OKボタンのテキスト（デフォルトは'YES'）
}

// 「Modalという定数は、Function Component（関数コンポーネント）である。引数の型はModalProps（上で定義している）を参照すること」の意。「:」（コロン）は「これ（左辺）はこれ（右辺）である」を意味する
// 中括弧内に引数の名前や定数を記載するのは、直接変数として受け取ることで「props.isOpen」のようにいちいちpropsを介して取得しないで済むようにするため
const Modal: React.FC<ModalProps> = ({
  isOpen,
  message,
  onClose,
  onConfirm,
  closeButtonText = 'NO', // デフォルト値を設定
  confirmButtonText = 'YES' // デフォルト値を設定
}) => {
  // isOpenがfalseの場合は何もレンダリングしない
  if (!isOpen) {
    return null;
  }

  // ボタンの種類を判別
  // YES/NOの2択か、OKのみか
  const isConfirmation = onConfirm && onClose; // YES/NO両方あるか
  const isNotification = onConfirm && !onClose; // OKのみか

  return (
    // 背景のオーバーレイ
    <div className="modal-overlay" onClick={onClose}>
      {/* モーダル本体。イベントが親に伝播しないようにする */}
      {/* イベントが親に伝播とは、子要素のボタンをクリックした時に親要素もクリックされたという扱いになってしまうこと */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <p className="modal-message">{message}</p>
        <div className="modal-buttons">
          {/* YES/NOの2択の場合 */}
          {isConfirmation && (
            <>
              <button className="modal-button modal-button-no" onClick={onClose}>
                {closeButtonText}
              </button>
              <button className="modal-button modal-button-yes" onClick={onConfirm}>
                {confirmButtonText}
              </button>
            </>
          )}

          {/* OKのみの通知の場合 */}
          {isNotification && (
            <button className="modal-button modal-button-ok" onClick={onConfirm}>
              {confirmButtonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;