import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from  '@angular/material/dialog';

import { WebSocketService } from '../web-socket.service'
import { PopupChatAddComponent } from '../popup-chat-add/popup-chat-add.component';
import { PopupChatSettingsComponent } from '../popup-chat-settings/popup-chat-settings.component';
import { PopupChatUserComponent } from '../popup-chat-user/popup-chat-user.component';

import { ChatChannel, ChatMessage } from '../models/chat.model'


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @Input() channels: ChatChannel[] = [];
  currentChannel!: ChatChannel;
  selectedChannel!: string;


  constructor(private webSocketService: WebSocketService, private dialogRef: MatDialog) { }

  ngOnInit(): void {
    this.currentChannel = {
      name: 'Général',
      owner: 'Corentin',
      admins: [],
      users: ['Corentin', 'Alexandre'],
      type: "Public",
      messages: [
        {
          userPseudo: "cgoncalv",
          userAvatar: "assets/avatar-placeholder-1.png",
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec posuere volutpat metus, non convallis felis bibendum ut. Sed aliquet, neque eget pretium pretium, lorem mauris condimentum mi, auctor placerat eros justo sed ante. Ut sed mi est. Cras dictum ornare augue a cursus. Vivamus pulvinar, ex sit amet feugiat vehicula, tellus lorem gravida urna, at blandit ex mi rhoncus tellus. Aenean nec pharetra ante. Phasellus lobortis mi at ipsum varius interdum. Maecenas aliquet lacus sagittis enim commodo maximus. Nulla tristique lacinia nisi eu condimentum. Ut eu turpis eleifend, porta risus eu, venenatis erat. Ut eu purus ac eros pretium placerat et sed dolor. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. ",
          date: new Date()
        },
        {
          userPseudo: "arapaill",
          userAvatar: "assets/avatar-placeholder-2.png",
          text: "This is another test",
          date: new Date()
        },
        {
          userPseudo: "arapaill",
          userAvatar: "assets/avatar-placeholder-2.png",
          text: "This is another test",
          date: new Date()
        },
        {
          userPseudo: "cgoncalv",
          userAvatar: "assets/avatar-placeholder-1.png",
          text: "This is the last test",
          date: new Date()
        },
      ]
    }

    let newChannel: ChatChannel = {
      name: 'Autre',
      owner: 'Corentin', // A changer
      admins: [],
      users: ['Corentin', 'Alexandre'],
      type: "Public",
      messages: [
        {
          userPseudo: "cgoncalv",
          userAvatar: "assets/avatar-placeholder-1.png",
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec posuere volutpat metus, non convallis felis bibendum ut. Sed aliquet, neque eget pretium pretium, lorem mauris condimentum mi, auctor placerat eros justo sed ante. Ut sed mi est. Cras dictum ornare augue a cursus. Vivamus pulvinar, ex sit amet feugiat vehicula, tellus lorem gravida urna, at blandit ex mi rhoncus tellus. Aenean nec pharetra ante. Phasellus lobortis mi at ipsum varius interdum. Maecenas aliquet lacus sagittis enim commodo maximus. Nulla tristique lacinia nisi eu condimentum. Ut eu turpis eleifend, porta risus eu, venenatis erat. Ut eu purus ac eros pretium placerat et sed dolor. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. ",
          date: new Date()
        }
      ]
    }

    this.channels.push(this.currentChannel);
    this.channels.push(newChannel);
    this.selectedChannel = this.currentChannel.name;

    this.webSocketService.listen("getChatMessages").subscribe((data) => {
      console.log(data);
    })
  }

  sendNewMessage(msg: any): void {
    if (msg.value == "")
      return ;
    let newMessage: ChatMessage = {
      userPseudo: "cgoncalv",
      userAvatar: "assets/avatar-placeholder-1.png",
      text: msg.value,
      date: new Date()
    }
    msg.value = "";
    this.currentChannel.messages.push(newMessage);
    this.webSocketService.emit("sendNewMessage", newMessage);
  }

  selectChannel(fchannel: string) {
    console.log(fchannel);
    let tmpChannel = this.channels.find(x => x.name === fchannel);
    console.log(tmpChannel);
    if (tmpChannel) {
      this.currentChannel = tmpChannel;
    }
  }

  createNewChannel(settings: any) {
    let newChannel: ChatChannel = {
      name: settings.name,
      owner: "Corentin", // A changer
      admins: settings.admin,
      users: settings.users,
      type: settings.type,
      password: settings.password,
      messages: []
    }
    this.channels.push(newChannel);
    this.webSocketService.socket.emit('createNewChannel', newChannel);
  }

  changeCurrentChannel(newSettings: any) {
    if (newSettings == "Delete") {
      let index = this.channels.indexOf(this.currentChannel);
      this.channels.splice(index, 1);
      return ;
    }
    this.currentChannel.name = newSettings.newName;
    this.currentChannel.type = newSettings.newType;
    if (this.currentChannel.type == "Protégé") {
      this.currentChannel.password = newSettings.newPassword;
    }
    // Ajouter users et admins
    this.webSocketService.emit('changeChannel', newSettings);
  }

  createMPChannel(user: string) {
    let newChannel: ChatChannel = {
      name: user + ' & ' + user, // A changer
      owner: "Corentin", // A changer
      admins: [user],
      users: [user],
      type: "Privé",
      password: "",
      messages: []
    }
    this.channels.push(newChannel);
    this.webSocketService.emit('createNewChannel', newChannel);
  }

  openSettingsDialog() {
    let settingsDialog = this.dialogRef.open(PopupChatSettingsComponent, {
      data: {
        name: this.currentChannel.name,
        owner: this.currentChannel.owner,
        type: this.currentChannel.type
      }
    });
  
    settingsDialog.afterClosed().subscribe(result => {
      this.changeCurrentChannel(result);
    });
  }

  openAddDialog() {
    let settingsDialog = this.dialogRef.open(PopupChatAddComponent);

    settingsDialog.afterClosed().subscribe(result => {
      this.createNewChannel(result);
    });
  }

  openUserProfile() {
    let profileDialog = this.dialogRef.open(PopupChatUserComponent);

    profileDialog.afterClosed().subscribe(result => {
      if (result)
        this.createMPChannel(result);
    });
  }

}
