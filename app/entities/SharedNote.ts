import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export default class SharedNote {
  @PrimaryColumn({ type: "text" })
  id: string;

  @Column({ type: "integer" })
  noteId: number;

  @Column({ type: "integer" })
  userId: number;

  constructor(noteId: number, userId: number) {
    this.noteId = noteId;
    this.userId = userId;
    this.id = `${noteId}-${userId}`;
  }
}
