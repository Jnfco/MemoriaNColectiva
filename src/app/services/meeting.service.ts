import { Injectable } from '@angular/core';
import {AngularFirestore,AngularFirestoreDocument} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class MeetingService {
  constructor( public fireservices: AngularFirestore,
    public db: AngularFirestore) {}


    addMeeting (){

    }
}
