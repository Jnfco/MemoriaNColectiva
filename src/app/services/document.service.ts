import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(public fireservices: AngularFirestore) { }

  create_newDocument()
  {
    //return this.fireservices.collection('Documento').add();
  }
}
