// src\App.tsx
import { useState, useEffect } from 'react';
// 各画面コンポーネントをインポート
import AttentionScreen from './screens/AttentionScreen';
import StartScreen from './screens/StartScreen';
import InfoDisplayScreen from './screens/InfoDisplayScreen';
import CharacterSelectScreen from './screens/CharacterSelectScreen';
import IndividualStoryScreen from './screens/IndividualStoryScreen';
import DiscussionScreen from './screens/DiscussionScreen';
import VotingScreen from './screens/VotingScreen';
import EndingScreen from './screens/EndingScreen';
import DebriefingScreen from './screens/DebriefingScreen';
import { type ScenarioData } from './types';
import { type TabItem } from './components/Tabs';
import TextRenderer from './components/TextRenderer';
import Timer from './components/Timer';
import Modal from './components/Modal';
import './style.css';

type GamePhase = 'attention' | 'start' | 'schedule' | 'synopsis' | 'characterSelect' | 'commonInfo' | 'individualStory' | 'firstDiscussion' | 'interlude' | 'secondDiscussion' | 'voting' | 'ending' | 'debriefing'
function App() {
  // HO読み込み時間（10分）
  const READING_TIME_SECONDS = 600;
  // HO読み込み延長時間（3分）
  const READING_TIME_SECONDS_EXTENSION = 180;
  // 第一議論フェイズ時間（10分）
  const FIRST_DISCUSSION_SECONDS = 600;
  // 第二議論フェイズ時間（10分）
  const SECOND_DISCUSSION_SECONDS = 600;
  // useStateを使って、gamePhaseの状態を管理する
  // 初期画面を 'attention' (注意書き画面) に設定
  const [gamePhase, setGamePhase] = useState<GamePhase>('attention');
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [votedCharacterId, setVotedCharacterId] = useState<string | null>(null);
  const [scenario, setScenario] = useState<ScenarioData | null>(null);
  const [readingTime, setReadingTime] = useState(READING_TIME_SECONDS);
  const [isReadingTimerTicking, setIsReadingTimerTicking] = useState(false);
  // HO読み込み時間終了モーダル表示フラグ
  const [isHoReadEndModalFlg, setIsHoReadEndModalFlg] = useState(false);

  // アプリケーション起動時にシナリオデータを読み込む
  useEffect(() => {
    fetch('/scenario.json')
      .then(response => response.json())
      .then(data => setScenario(data))
      .catch(error => console.error("シナリオの読み込みに失敗:", error));
  }, []); // 空の配列を渡して、初回レンダリング時に一度だけ実行

  // キャラクターが選択されたときのハンドラ
  const handleCharacterSelect = (characterId: string) => {
    setSelectedCharacterId(characterId);
    setGamePhase('commonInfo'); // 次の画面へ
  };
  // 投票が完了したときのハンドラ
  const handleVoteComplete = (votedId: string) => {
    setVotedCharacterId(votedId);
    setGamePhase('ending'); // エンディング画面へ
  };

  /**
   * 共通情報・個別ストーリー画面用タイマーロジック
   */
  // [タイマーロジック1] isReadingTimerTickingがtrueになったら1秒ごとに時間を減らす
  useEffect(() => {
    if (!isReadingTimerTicking || readingTime <= 0) {
      return;
    }
    const timerId = setInterval(() => {
      setReadingTime(prevTime => prevTime - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [isReadingTimerTicking, readingTime]);

  // [タイマーロジック2] gamePhaseの変更を監視してタイマーを開始/停止する
  useEffect(() => {
    // commonInfo画面になったらタイマーを開始
    if (gamePhase === 'commonInfo') {
      setIsReadingTimerTicking(true);
    }
    // 議論フェーズに入ったらタイマーを停止・リセット
    else if (gamePhase === 'firstDiscussion') {
      setIsReadingTimerTicking(false);
      setReadingTime(READING_TIME_SECONDS); // 次回のためにリセット
    }
  }, [gamePhase]);

  // [タイマーロジック3] 時間がゼロになったら読み込み時間を延長するか質問するモーダルをオープン
  useEffect(() => {
    if (readingTime === 0) {
      setIsReadingTimerTicking(false);
      setIsHoReadEndModalFlg(true);
    }
  }, [readingTime]);

  // Timerコンポーネントを使い回すために、ダミーのonTimeUp関数(何もしない)を用意
  const dummyOnTimeUp = () => { };

  // 画面間共通タイマーを表示する画面（共通情報・個別ストーリー）かどうか判定
  const shouldShowReadingTimer = gamePhase === 'commonInfo' || gamePhase === 'individualStory';

  // gamePhaseの値に応じて表示するコンポーネントを切り替える
  const renderScreen = () => {
    // --- Guard 1: シナリオデータの読み込みチェック ---
    // attention画面以外ではシナリオデータが必須。
    // まだ読み込めていない（nullの）場合は、ローディング表示を返す。
    if (gamePhase !== 'attention' && !scenario) {
      return <div>シナリオを読み込んでいます...</div>;
    }

    // --- Guard 2: キャラクター選択のチェック ---
    // individualStory以降のフェーズで、キャラクターが未選択（null）の場合は
    // エラーメッセージを表示するか、選択画面にリダイレクトする。
    const characterDependentPhases: GamePhase[] = [
      'individualStory',
      'firstDiscussion',
      'secondDiscussion',
      'voting',
      'ending',
      'debriefing'
    ];
    if (characterDependentPhases.includes(gamePhase) && !selectedCharacterId) {
      // ここでエラーを出すか、選択画面に戻すか選べる
      // setGamePhase('characterSelect'); // 強制的に戻す場合
      return <div>キャラクターが選択されていません。ページをリロードした場合は、最初からやり直してください。</div>;
    }

    // 選択キャラクター情報
    const selectedChar = scenario?.characters.find(char => char.id === selectedCharacterId);
    switch (gamePhase) {
      case 'attention':
        // onNextプロパティとして、gamePhaseを次に進める関数を渡す
        return <AttentionScreen onNext={() => setGamePhase('start')} />;
      case 'start':
        return <StartScreen title={scenario!.title} onNext={() => setGamePhase('schedule')} />;
      case 'schedule':
        return <InfoDisplayScreen title="進行スケジュール" filePath={scenario!.scheduleFile} onBackFlg={false} onBack={() => { }} onNext={() => setGamePhase('synopsis')} />;
      case 'synopsis':
        return <InfoDisplayScreen title="あらすじ" filePath={scenario!.synopsisFile} onBackFlg={true} onBack={() => setGamePhase('schedule')} onNext={() => setGamePhase('characterSelect')} />;
      case 'characterSelect':
        return (
          <CharacterSelectScreen
            characters={scenario!.characters}
            onBack={() => setGamePhase('synopsis')}
            onCharacterSelect={handleCharacterSelect}
          />
        );
      case 'commonInfo':
        return <InfoDisplayScreen title="ハンドアウト読み込み：共通情報" filePath={scenario!.commonInfo.textFile} onBackFlg={false} onBack={() => { }} onNext={() => setGamePhase('individualStory')} />;
      case 'individualStory': { // 波括弧でスコープを作成
        // 選択されたキャラクターIDがなければ、エラー表示または初期画面に戻す
        if (!selectedCharacterId) {
          return <div>キャラクターが選択されていません。最初からやり直してください。</div>;
        }

        // 選択されたキャラクターのオブジェクトを探す
        const selectedChar = scenario!.characters.find(
          char => char.id === selectedCharacterId
        );

        // キャラクターが見つからなかった場合のガード
        if (!selectedChar) {
          return <div>選択されたキャラクター情報が見つかりません。</div>;
        }

        return (
          <IndividualStoryScreen
            character={selectedChar!} // ! は「null/undefinedではない」とTSに断言する。ガードがあるので安全。
            onBack={() => setGamePhase('commonInfo')}
            onNext={() => setGamePhase('firstDiscussion')}
          />
        );
      }
      case 'firstDiscussion': {
        const tabItems: TabItem[] = [
          {
            label: '共通情報',
            content: <TextRenderer filePath={scenario!.commonInfo.textFile} />
          },
          {
            label: '個別ストーリー',
            content: selectedChar!.storyFile ? <TextRenderer filePath={selectedChar!.storyFile} /> : <div />
          }
        ];
        return (
          <DiscussionScreen
            title="第一議論フェイズ"
            character={selectedChar!}
            tabItems={tabItems}
            discussionTime={FIRST_DISCUSSION_SECONDS}
            onNext={() => setGamePhase('interlude')}
          />
        );
      }
      case 'interlude':
        return (
          <InfoDisplayScreen
            title="中間情報"
            filePath={scenario!.intermediateInfo.textFile}
            onBackFlg={false} onBack={() => { }}
            onNext={() => setGamePhase('secondDiscussion')} // 次は第二議論
          />
        );
      case 'secondDiscussion': {
        const tabItems: TabItem[] = [
          {
            label: '共通情報',
            content: <TextRenderer filePath={scenario!.commonInfo.textFile} />
          },
          {
            label: '個別ストーリー',
            content: selectedChar!.storyFile ? <TextRenderer filePath={selectedChar!.storyFile} /> : <div />
          },
          {
            label: '中間情報',
            content: <TextRenderer filePath={scenario!.intermediateInfo.textFile} />
          }
        ];
        return (
          <DiscussionScreen
            title="第二議論フェイズ"
            character={selectedChar!}
            tabItems={tabItems}
            discussionTime={SECOND_DISCUSSION_SECONDS}
            onNext={() => setGamePhase('voting')}
          />
        );
      }
      case 'voting':
        return (
          <VotingScreen
            characters={scenario!.characters}
            onVoteComplete={handleVoteComplete}
          />
        );
      case 'ending': {
        // 投票結果IDがなければエラー
        if (!votedCharacterId) {
          return <div>投票結果がありません。</div>;
        }

        // 投票結果IDに一致するエンディングを探す
        let targetEnding = scenario!.endings.find(
          end => end.votedCharId === votedCharacterId
        );

        // もし一致するエンディングがなければ、defaultエンディングを探す
        if (!targetEnding) {
          targetEnding = scenario!.endings.find(
            end => end.votedCharId === 'default'
          );
        }

        // それでもエンディングが見つからなければエラー
        if (!targetEnding) {
          return <div>対応するエンディングが見つかりません。</div>
        }

        return (
          <EndingScreen
            ending={targetEnding}
            onNext={() => setGamePhase('debriefing')} // 次は感想戦画面
          />
        );
      }
      case 'debriefing':
        return <DebriefingScreen scenario={scenario!} />;
      default:
        // 想定外のgamePhaseになった場合のフォールバック
        return <AttentionScreen onNext={() => setGamePhase('start')} />;
    }
  };

  return (
    <div className="App">
      {/* タイマーを表示すべきフェーズなら、タイマーを画面の上（や下）に表示 */}
      {shouldShowReadingTimer && (
        <><div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: '1001' }}>
          <Timer
            initialSeconds={readingTime} // 現在の残り時間を渡す
            isTicking={isReadingTimerTicking} // isTickingの状態を渡す
            onTimeUp={dummyOnTimeUp} // 何もしない関数を渡す
          />
        </div><Modal
            isOpen={isHoReadEndModalFlg}
            message={'第一議論フェイズ画面に移動します。よろしいですか？\n読み込み時間を延長することもできます'}
            onConfirm={() => setGamePhase('firstDiscussion')}
            onClose={() => { setIsHoReadEndModalFlg(false); setReadingTime(READING_TIME_SECONDS_EXTENSION); setIsReadingTimerTicking(true); }}
            confirmButtonText={"OK"}
            closeButtonText={"延長する(3分)"} /></>
      )}
      {/* 上記の関数を呼び出して、適切な画面を描画する */}
      {renderScreen()}
    </div>
  );
}

export default App;