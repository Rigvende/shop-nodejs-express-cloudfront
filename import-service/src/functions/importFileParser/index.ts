import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: 'my-bucket-for-toys-store',
        event: 's3:ObjectCreated:*',
        rules: [
          {
            prefix: 'parsed/'     
          }
        ],
        existing: true
      }
    }
  ]
}
