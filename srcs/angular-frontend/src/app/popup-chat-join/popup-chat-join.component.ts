import { Component, OnInit, Inject, Optional } from '@angular/core';
import { ChatChannel } from '../models/chat.model';
import { WebSocketService } from '../web-socket.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { myUser } from '../models/user.model';

@Component({
  selector: 'app-popup-chat-join',
  templateUrl: './popup-chat-join.component.html',
  styleUrls: ['./popup-chat-join.component.scss']
})
export class PopupChatJoinComponent implements OnInit {
  channels: ChatChannel[] = []
  channelsToDisplay: ChatChannel[] = []

  constructor(
    public webSocketService: WebSocketService,
    public myUser: myUser,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PopupChatJoinComponent>) {
      this.myUser.avatar = data.avatar;
      this.myUser.pseudo = data.pseudo;
      this.myUser.blacklist = data.blacklist;
      this.myUser.friends = data.friends;
      this.myUser.id = data.id;
  }

  ngOnInit(): void {
    this.webSocketService.emit("requestChannels", this.myUser);
    this.webSocketService.listen("getChannels").subscribe((data: any) => {
      if (data.length == 0)
        return ;
      if (this.channels.length != 1)
        this.channels = [];
      for (const channel of data) {
        let newChannel: ChatChannel = {
          id: channel.id,
          name: channel.name,
          owner: channel.owner,
          admins: channel.admins,
          users: channel.users,
          type: channel.type,
          usersBanned: channel.usersBanned,
          usersKicked: channel.usersKicked,
          usersMuted: channel.usersMuted,
          messages: []
        }

        if (newChannel.type != 'Privé' && newChannel.users.indexOf(this.myUser.pseudo) == -1 && newChannel.admins.indexOf(this.myUser.pseudo) == -1)
          this.channelsToDisplay.push(newChannel);
      }
    })

  }


  join(values: any) {
    let tmpChannel = this.channelsToDisplay.find(x => x.name === values.channel);
    if (tmpChannel?.usersBanned.indexOf(this.myUser.id) != -1) {
      alert("Vous êtes banni de ce channel.");
      this.dialogRef.close();
    }
    this.dialogRef.close(tmpChannel?.id);
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
