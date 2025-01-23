import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class DropsignEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  subject: string;

  @Column()
  message: string;

  @Column('json')
  participants: Array<{ name: string; email: string }>;

  @Column()
  status: string;

  @Column('text')
  fileContent: string; // Base64 content

  @CreateDateColumn()
  createdAt: Date;
}

