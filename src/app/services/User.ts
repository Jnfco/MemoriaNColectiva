export interface IUser {
  uid: string;
  email: string;
  name: string;
  organization: string;
  isAdmin:boolean;
}

export interface IUserSindicato {
  uid: string;
  email: string;
  name: string;
  organization: string;
  isAdmin:boolean;
  idSindicato:string;
}
