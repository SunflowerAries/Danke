import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('type', ['type', 'typeId'], { unique: true })
@Entity('universal_id')
export class UniversalId {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'type', length: 30 })
  type: string;

  @Column('int', { name: 'type_id' })
  typeId: number;

  @Column('timestamp', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
