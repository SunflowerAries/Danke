import { Column, Entity } from 'typeorm';

@Entity('reaction')
export class Reaction {
  @Column('int', { primary: true, name: 'id' })
  id: number;

  @Column('varchar', { primary: true, name: 'emoji_id', length: 14 })
  emojiId: string;

  @Column('int', { primary: true, name: 'user_id' })
  userId: number;

  @Column('timestamp', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
