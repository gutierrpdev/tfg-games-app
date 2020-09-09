export interface GetUserResponse {
  blekPlayed: boolean;
  edgePlayed: boolean;
  unpossiblePlayed: boolean;
  userId: string;
  userAge: number;
  userGender: string;
  questionsCompleted: boolean;
}

export const getUserResponseSchema = {
  type: 'object',
  properties: {
    blekPlayed: { type: 'boolean' },
    edgePlayed: { type: 'boolean' },
    unpossiblePlayed: { type: 'boolean' },
    userId: { type: 'string', minLength: 1 },
    userAge: { type: 'number' },
    userGender: { type: 'string' },
    questionsCompleted: { type: 'boolean' },
  },
  required: [
    'blekPlayed',
    'edgePlayed',
    'unpossiblePlayed',
    'userId',
    'userAge',
    'userGender',
    'questionsCompleted',
  ],
};

export interface SubmitEventRequest {
  timestamp: number;
  userId: string;
  gameName: string;
  name: string;
  orderInSequence: number;
  parameters: Array<{name: string, value: string}>;
};

export const SubmitEventRequestSchema = {
  type: 'object',
  properties: {
    timestamp: { type: 'number' },
    gameName: { type: 'string', enum: ['Blek', 'Edge', 'Unpossible'] },
    userId: { type: 'string', minLength: 1 },
    name: { type: 'string', minLength: 1 },
    orderInSequence: { type: 'number' },
    parameters: { type: 'array', items: {
      type: 'object',
      properties: {
        name: { type: 'string', minLength: 1 },
        value: { type: 'string' },
      },
      required: [
        'name',
        'value',
      ],
    }},
  },
  required: [
    'timestamp',
    'userId',
    'name',
    'gameName',
    'orderInSequence',
  ],
};