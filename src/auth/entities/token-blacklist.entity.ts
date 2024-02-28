import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/entity';

@Entity()
export class TokenBlacklist extends BaseEntity {
  @Column()
  token: string;

  @Column()
  jti: string;

  @Column()
  tokenType: 'access' | 'refresh';

  @Column({ type: 'timestamp' })
  expiresAt: Date;
}
