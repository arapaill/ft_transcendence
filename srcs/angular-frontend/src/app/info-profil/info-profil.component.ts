import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from  '@angular/material/dialog';
import { PopupAddFriendComponent } from "../popup-add-friend/popup-add-friend.component";
import { WebSocketService } from '../web-socket.service'
import { ProfileModel} from "../models/profile-model.model";
import { myUser, User} from '../models/user.model';

@Component({
  selector: 'app-info-profil',
  templateUrl: './info-profil.component.html',

  styleUrls: ['./info-profil.component.scss']
  
})
export class InfoProfilComponent implements OnInit {
  Personne!: ProfileModel;
  percentDone!: number;
  uploadSuccess!: boolean;
  matchs !: string[];
  nameProfil !: string;
  userID : number = 0;
  constructor(private webSocketService: WebSocketService, private  dialogRef : MatDialog, @Inject(MAT_DIALOG_DATA) public data : any, public myUser : myUser) {
    this.nameProfil = data.name;

  }

  ngOnInit(): void {
    this.webSocketService.emit("requestUserInfosID", Number(localStorage.getItem('id')));
    this.webSocketService.listen("getUserInfosID").subscribe((data: any) => {
      this.myUser.avatar = data.avatar;
      this.myUser.pseudo = data.name;
      this.myUser.description = data.Description;
      this.myUser.blacklist = data.blacklist;
      this.myUser.id = data.id;
    });
    this.Personne = 
      {
        avatar: 'assets/avatar-placeholder-1.png',
        name: this.nameProfil,
        description: "I am Tester and I test things like this website or some other stuffs.",
        date: new Date(),
        victoires: 0,
        match: false,
        id: 13
      }
    this.webSocketService.emit("requestUserInfos", this.Personne.name);
    this.webSocketService.listen("getUserInfos").subscribe((data: any) => {
      console.log(data);
      this.Personne.name = data.name;
      this.userID = data.id;
      
    });
    
    this.webSocketService.emit("requestUserMatchHistory", this.Personne.name);
    this.webSocketService.listen("getMatchHistory").subscribe((userMatchs : any) => {
      console.log(userMatchs);
      //this.matchs = userMatchs,
    });
    
    this.matchs = [
      "arapaill vs Cgoncalv 1.0",
      "arapaill vs pet 8.9",
    ]

  
  } //end of ngoninit
  
  addToFriends() {
    if (!this.myUser.friends.has(this.Personne.name)) {
      this.myUser.friends.set(this.Personne.name, this.userID);
      this.myUser.friends = this.myUser.friends;
    }
    else
      this.myUser.friends.delete(this.Personne.name);
    this.webSocketService.emit("updateFriendlist", this.userID);
  }
}
