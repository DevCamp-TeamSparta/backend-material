import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto<T> {
  @ApiProperty({
    description: 'status code',
    example: 200,
    type: 'number',
  })
  statusCode: number;

  @ApiProperty({
    description: '응답 메시지',
    example: 'insert success',
    type: 'string',
  })
  message: string;

  @ApiProperty({
    description: '응답 메시지',
    example: 'insert success',
    type: () => ResponseDto['data'],
  })
  data: T;

  constructor(code: number, message: string, data?: T) {
    this.statusCode = code;
    this.message = message;
    this.data = data;
  }
}
