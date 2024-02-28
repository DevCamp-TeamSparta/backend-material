import { HttpStatus } from '@nestjs/common';

export const createCommonResponseDocs = (
  status: HttpStatus,
  message: string,
) => {
  return {
    properties: {
      statusCode: { example: status },
      message: { example: message },
    },
  };
};
