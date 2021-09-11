import { Client } from 'pg';

const { 
  PG_HOST, 
  PG_PORT, 
  PG_DATABASE, 
  PG_USERNAME, 
  PG_PASSWORD 
} = process.env;

const dbOptions = {
    host: PG_HOST,
    port: Number(PG_PORT),
    user: PG_USERNAME,
    password: PG_PASSWORD,
    database: PG_DATABASE,
    ssl: {
        rejectUnauthorized: false
    },
    connectionTimeoutMillis: 5000
};

export class DbConnect {
    private static client: Client;

    private constructor() {}

    public static getClient() {
        if (!DbConnect.client) {
            DbConnect.client = new Client(dbOptions);
        }
        return DbConnect.client;
    }

    public static async connect() {
        await DbConnect.client.connect();
    }

    public static async end() {
        await DbConnect.client.end();
    }
}
