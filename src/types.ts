// src/types.ts
export interface Goal {
    text: string;           // 目標テキスト
    points: number;         // 点数
}

// キャラクター情報
export interface Character {
    id: string;             // キャラクターID
    name: string;           // キャラクター名
    type: 'PC' | 'NPC';     // キャラクタータイプ
    profile: string;        // プロフィール
    goals?: Goal[];         // 目標(PCのみ)
    storyFile?: string;     // ストーリーファイルパス(PCのみ)
    mapImageFile?: string;  // 地図ファイルパス(PCのみ)
}
// エンディング情報
export interface Ending {
  votedCharId: string;
  endingFile: string;
  title: string;
}

export interface ScenarioData {
  title: string;
  scheduleFile: string,
  synopsisFile: string,
  commonInfo: {
    textFile: string;
  };
  intermediateInfo: {
    textFile: string;
  };
  characters: Character[];
  endings: Ending[];
}
export interface DebriefingContent {
  title: string;
  file: string;
}

export interface DebriefingCharacterEnding {
  id: string;
  title: string;
  file: string;
}

export interface ScenarioData {
  endings: Ending[];
  debriefing: {
    mainCommentary: DebriefingContent;
    characterEndings: DebriefingCharacterEnding[];
  };
}