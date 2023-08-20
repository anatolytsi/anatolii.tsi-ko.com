import nextConnect from 'next-connect';
import middleware, { IDbApiRequest } from '@/middleware/resume-database';
import { NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Db } from 'mongodb';

const handler = nextConnect();

handler.use(middleware);

const dropCollection = async (db: Db, collection: string) => {
    if ((await db.listCollections().toArray()).map(c => c.name).includes(collection)) {
        await db.collection(collection).drop();
    }
}

handler.get(async (req: IDbApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions);
    if (session?.user?.role === 'admin') {
        try {
            const personalInfo = await req.db.collection('personalInfo').findOne();
            const skills = await req.db.collection('skills').findOne();
    
            const resumeSections = await req.db.collection('resumeSections').find({}).toArray();
            const jobExperience = await req.db.collection('jobExperience').find({}).toArray();
            const education = await req.db.collection('education').find({}).toArray();
            const internships = await req.db.collection('internships').find({}).toArray();
            const languages = await req.db.collection('languages').find({}).toArray();
            const certifications = await req.db.collection('certifications').find({}).toArray();
            const projects = await req.db.collection('projects').find({}).toArray();
            const publications = await req.db.collection('publications').find({}).toArray();
            const hobbies = await req.db.collection('hobbies').find({}).toArray();
            
            const resumeData = {
                resumeSections,
                personalInfo,
                jobExperience,
                education,
                internships,
                skills,
                languages,
                certifications,
                projects,
                publications,
                hobbies
            };

            res.status(200).send(JSON.stringify(resumeData, undefined, 2).replaceAll(/"_id":[^,]+,\s+/g, ''));
        } catch (e: any) {
            res.status(500);
            throw new Error(e).message;
        }
    } else {
        res.status(403);
    }
});

handler.post(async (req: IDbApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions);
    let {
        // query,
        body
    } = req;
    if (session?.user?.role === 'admin') {
        try {
            let resume = JSON.parse(body);

            if (!resume) {
                res.status(400).end();
                return;
            }
            await dropCollection(req.db, 'personalInfo');
            await dropCollection(req.db, 'skills');
            await dropCollection(req.db, 'resumeSections');
            await dropCollection(req.db, 'jobExperience');
            await dropCollection(req.db, 'education');
            await dropCollection(req.db, 'internships');
            await dropCollection(req.db, 'languages');
            await dropCollection(req.db, 'certifications');
            await dropCollection(req.db, 'projects');
            await dropCollection(req.db, 'publications');
            await dropCollection(req.db, 'hobbies');
            await dropCollection(req.db, 'expPortfolios');

            let db = req.dbClient.db(process.env.MONGODB_DB);
            for (const property in resume) {
                if (Array.isArray(resume[property])) {
                    if (!resume[property].length) continue;
                    await db.collection(property).insertMany(resume[property]);
                } else if (typeof resume[property] === 'object') {
                    await db.collection(property).insertOne(resume[property]);
                }
            }
            res.status(200);
        } catch (e: any) {
            res.status(500);
            console.error(e);
            throw new Error(e).message;
        }
    } else {
        res.status(403);
    }
    res.end();
});

export default handler;
