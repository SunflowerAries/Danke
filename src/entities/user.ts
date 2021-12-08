import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('uk_email', ['email'], { unique: true })
@Index('uk_name', ['name'], { unique: true })
@Entity('user')
export class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 30 })
  name: string;

  @Column('varchar', { name: 'email', length: 64 })
  email: string;

  @Column('char', { name: 'saltedPassword', length: 145 })
  saltedPassword: string;

  @Column('varchar', { name: 'nickName', nullable: true, length: 30 })
  nickName: string | null;

  @Column('varchar', {
    name: 'avatar',
    length: 96,
    default: () => "'/static/default_avatar.png'",
  })
  avatar: string;

  @Column('varchar', { name: 'bio', nullable: true, length: 128 })
  bio: string | null;

  @Column('datetime', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('datetime', {
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
