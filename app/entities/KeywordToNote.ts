import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import Note from "./Note";

@Entity()
@Index("IDX_keyword", ["keyword"])
export default class KeywordToNote {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text" })
  keyword: string;

  @ManyToOne(() => Note)
  @JoinColumn({ name: "noteId" })
  note!: Note;

  @Column({ type: "integer" })
  userId: number;

  constructor(note: Note, keyword: string, userId: number) {
    this.note = note;
    this.keyword = keyword;
    this.userId = userId;
  }
}
