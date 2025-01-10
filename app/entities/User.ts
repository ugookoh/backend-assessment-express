import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import Note from "./Note";

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, type: "text" })
  email: string;

  @Column({ type: "text" })
  password: string;

  @OneToMany(() => Note, (note) => note.user)
  notes!: Note[];

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
