import { IDbApiRequest } from "@/middleware/resume-database";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import axios, { AxiosResponse } from "axios";
import { IncomingMessage, ServerResponse } from "http";
import { ObjectId } from "mongodb";
import { NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { NextConnect } from "next-connect";


export const attachGet = (handler: NextConnect<IncomingMessage, ServerResponse<IncomingMessage>>, collection: string) => {
    handler.get(async (req: IDbApiRequest, res: NextApiResponse) => {
        const session = await getServerSession(req, res, authOptions);
        if (session?.user?.role === 'admin') {
            try {
                const {
                    query: { id },
                } = req;
                const oId = new ObjectId(Array.isArray(id) ? undefined : id);
                let doc = await req.db.collection(collection).findOne({_id: oId});
                res.status(200).json(doc);
            } catch (e: any) {
                res.status(500);
                throw new Error(e).message;
            }
        } else {
            res.status(403);
        }
    });
}

export const attachGetList = (handler: NextConnect<IncomingMessage, ServerResponse<IncomingMessage>>, collection: string) => {
    handler.get(async (req: IDbApiRequest, res: NextApiResponse) => {
        const session = await getServerSession(req, res, authOptions);
        if (session?.user?.role === 'admin') {
            try {
                let doc = await req.db.collection(collection).find({}).toArray();
                res.status(200).json(doc);
            } catch (e: any) {
                res.status(500);
                throw new Error(e).message;
            }
        } else {
            res.status(403);
        }
    });
}

export const attachPost = (handler: NextConnect<IncomingMessage, ServerResponse<IncomingMessage>>, collection: string) => {
    handler.post(async (req: IDbApiRequest, res: NextApiResponse) => {
        const session = await getServerSession(req, res, authOptions);
        let {
            query,
            body
        } = req;
        if (session?.user?.role === 'admin') {
            try {
                if ('id' in query) {
                    const id = query.id;
                    const oId = new ObjectId(Array.isArray(id) ? undefined : id);
                    delete body._id;
                    let doc = await req.db.collection(collection).findOneAndReplace({_id: oId}, body);
                    res.status(200).json(doc);
                } else {
                    let doc = await req.db.collection(collection).insertOne(body);
                    res.status(201).json(doc);
                }
            } catch (e: any) {
                res.status(500);
                throw new Error(e).message;
            }
        } else {
            res.status(403);
        }
        res.end();
    });
}

export const attachDelete = (handler: NextConnect<IncomingMessage, ServerResponse<IncomingMessage>>, collection: string) => {
    handler.delete(async (req: IDbApiRequest, res: NextApiResponse) => {
        const session = await getServerSession(req, res, authOptions);
        let {
            query
        } = req;
        if (session?.user?.role === 'admin') {
            try {
                if ('id' in query) {
                    const id = query.id;
                    const oId = new ObjectId(Array.isArray(id) ? undefined : id);
                    let doc = await req.db.collection(collection).deleteOne({_id: oId});
                    res.status(200).json(doc);
                } else {
                    res.status(404)
                }
            } catch (e: any) {
                res.status(500);
                throw new Error(e).message;
            }
        } else {
            res.status(403);
        }
        res.end();
    });
}

export const attachPostList = (handler: NextConnect<IncomingMessage, ServerResponse<IncomingMessage>>, collection: string) => {
    handler.post(async (req: IDbApiRequest, res: NextApiResponse) => {
        const session = await getServerSession(req, res, authOptions);
        let {
            // query,
            body
        } = req;
        if (session?.user?.role === 'admin') {
            try {
                let doc = await req.db.collection(collection).insertOne(body);
                if (doc.insertedId) {
                    let insertedDoc = await req.db.collection(collection).findOne({_id: doc.insertedId});
                    res.status(201).json(insertedDoc);
                }
                res.status(500).json(doc);
            } catch (e: any) {
                res.status(500);
                throw new Error(e).message;
            }
        } else {
            res.status(403);
        }
        res.end();
    });
}
