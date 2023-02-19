export interface UserMessage {
  user: string;
  message: string;
  timestamp: Date;
}

export interface JoinLeaveData {
  user: string;
  room: string;
}

export interface ChatMessageData extends JoinLeaveData {
  message: string;
}
