import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('teach_lesson')
export class TeachLesson {
  @PrimaryColumn({ type: 'int', name: 'instructor_id' })
  instructorId: number;

  @PrimaryColumn({ name: 'lesson_id', type: 'int' })
  lessonId: number;

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
