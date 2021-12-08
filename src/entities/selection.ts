import { Column, Entity } from 'typeorm';

@Entity('selection')
export class Selection {
  @Column('int', { primary: true, name: 'lesson_id' })
  lessonId: number;

  @Column('int', { primary: true, name: 'user_id' })
  userId: number;

  @Column('timestamp', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('varchar', { name: 'semester', nullable: true, length: 20 })
  semester: string;
}
