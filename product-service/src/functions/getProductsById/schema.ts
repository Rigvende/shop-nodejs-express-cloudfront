export default {
  type: "object",
  properties: {
    product: {
      type: 'object',
      properties: {
        count: { type: 'number' },
        description: { type: 'string' },
        id: { type: 'string' },
        price: { type: 'number' },
        title: { type: 'string' },
        url: { type: 'string' }
      }
    }
  }
} as const;
