// nextauth.d.ts
import { DefaultSession, DefaultUser } from 'next-auth';

// Define a role enum
export enum Role {
  user = 'user',
  admin = 'admin',
}

// common interface for JWT and Session
export interface IUser extends DefaultUser {
  role?: Role;
}

declare module 'next-auth' {
  interface User extends IUser {}
  interface Session {
    user?: User;
  }
}

declare module 'next-auth/jwt' {
  export interface JWT extends IUser {}
}
