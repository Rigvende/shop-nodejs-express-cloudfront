export default {
  type: "object",
  properties: {
    products: { 
      type: 'array',
      items: {
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
  }
} as const;
