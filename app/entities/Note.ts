import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import User from "./User";

@Entity()
export default class Note {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text" })
  content: string;

  @Column("simple-array")
  keywords: string[];

  @ManyToOne(() => User, (user) => user.notes)
  @JoinColumn({ name: "userId" }) // Specifies the foreign key column
  user!: User;

  constructor(content: string, user: User, keywords: string[]) {
    this.content = content;
    this.keywords = keywords;
    this.user = user;
  }
}
