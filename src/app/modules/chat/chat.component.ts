import { Component, OnInit } from '@angular/core';
import { UserMessage } from '../../interfaces/chat.interface';
import { InstantChatService } from '../../services/instant-chat.service';

@Component({
  selector: 'app-instant-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  user!: string;
  room: string = '';
  messageText!: string;
  messageArray: UserMessage[] = [];
  userList: string[] = [];

  constructor(private chatService: InstantChatService) {}

  ngOnInit(): void {
    this.chatService.joinRoom({ user: this.user, room: 'chat' });

    window.onbeforeunload = () => {
      this.chatService.leaveRoom({ user: this.user, room: this.room });
    };

    this.chatService.newUserJoined().subscribe((data) => {
      if (!this.userList.includes(data.user)) {
        this.userList.push(data.user);
        if (this.userList.length > 1) {
          this.messageArray.push({
            user: '',
            message: `${data.user} has joined the room.`,
            timestamp: new Date(),
          });
        }
      }
    });

    this.chatService.userLeftRoom().subscribe((data) => {
      this.messageArray.push(data);
      this.userList = this.userList.filter((user) => user !== data.user);
    });

    this.chatService.newMessageReceived().subscribe((data) => {
      this.messageArray.push(data);
    });
  }

  toggleRoom(room: string): void {
    if (room === '') {
      this.chatService.leaveRoom({ user: this.user, room: this.room });
    } else {
      this.chatService.joinRoom({ user: this.user, room: room });
    }
    this.room = room;
  }

  sendMessage(): void {
    this.chatService.sendMessage({
      user: this.user,
      room: this.room,
      message: this.messageText,
    });
    this.messageText = '';
  }
}
