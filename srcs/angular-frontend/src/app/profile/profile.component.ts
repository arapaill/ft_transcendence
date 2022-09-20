import { Component, OnInit, Input } from '@angular/core';
import { ProfileModel} from "../models/profile-model.model"

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @Input() Personne!: ProfileModel;
  imgSrc!: string;
  title!: string;
  constructor() { }

  ngOnInit(): void {
    this.Personne = 
      {
        Name: "Tester",
        Description: "I am Tester and I test things like this website or some other stuffs.",
        date: new Date(),
        victoires: 0
        
      }
      this.imgSrc = 'assets/avatar-placeholder-1.png';
      this.title = "avatar-placeholder-1"
  }

}
