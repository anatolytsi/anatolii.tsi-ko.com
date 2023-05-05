import { IncomingMessage, ServerResponse } from 'http';
import { Db, MongoClient } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect, { Middleware } from 'next-connect';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local')
}

const client = new MongoClient(process.env.MONGODB_URI!);

export interface IDbApiRequest extends NextApiRequest {
    dbClient: MongoClient
    db: Db
}

async function database(req: IDbApiRequest, res: NextApiResponse, next: any) {
    req.dbClient = client;
    req.db = client.db(process.env.MONGODB_DB);
    return next();
}

const middleware = nextConnect();

middleware.use(database);

export default middleware;
