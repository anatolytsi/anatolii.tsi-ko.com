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
            const jobExperiences = await req.db.collection('jobExperience').find({}).toArray();
            const education = await req.db.collection('education').find({}).toArray();
            const internships = await req.db.collection('internships').find({}).toArray();
            const projects = await req.db.collection('projects').find({}).toArray();

            let expPortfolios: any[] = [];
            let experiences = [...jobExperiences, ...education, ...internships, ...projects];
    
            await new Promise((resolve, reject) => {
                experiences.forEach(async (experience, idx) => {
                    let expPortfolio = JSON.parse(JSON.stringify(await req.db.collection('expPortfolios').findOne({experience: experience._id.toString()})));
                    if (expPortfolio) {
                        expPortfolio.experience = {
                            title: experience.title,
                            startDate: experience.startDate,
                            endDate: experience.endDate,
                        };
                        expPortfolios.push(expPortfolio);
                    }
                    if (idx === (experiences.length - 1)) {
                        resolve(true);
                    }
                })
            });
            
            const portfolioData = {
                expPortfolios
            };

            res.status(200).send(JSON.stringify(portfolioData, undefined, 2).replaceAll(/"_id":[^,]+,\s+/g, ''));
        } catch (e: any) {
            res.status(500);
            throw new Error(e).message;
        }
    } else {
        res.status(403);
    }
});

const findExperience = async (db: Db, collections: string[], title: string, startDate: number, endDate: number) => {
    for (const collection of collections) {
        let experience = await db.collection(collection).findOne({title, startDate, endDate});
        if (experience) return experience._id;
    }
    return null;
}

handler.post(async (req: IDbApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions);
    let {
        // query,
        body
    } = req;
    if (session?.user?.role === 'admin') {
        try {
            let portfolio = JSON.parse(body);
            if (!portfolio || !('expPortfolios' in portfolio)) {
                res.status(400).end();
                return;
            }
            await dropCollection(req.db, 'expPortfolios');

            let db = req.dbClient.db(process.env.MONGODB_DB);
            
            await new Promise((resolve, reject) => {
                portfolio.expPortfolios.forEach(async (expPortfolio: any, idx: number) => {
                    let experience = {
                        title: expPortfolio.experience.title,
                        startDate: expPortfolio.experience.startDate,
                        endDate: expPortfolio.experience.endDate,
                    }
                    delete expPortfolio.experience;

                    let experienceId = await findExperience(db, ['jobExperience', 'education', 'internships', 'projects'], experience.title, experience.startDate, experience.endDate);

                    if (experienceId) {
                        expPortfolio.experience = experienceId.toString();
                        await db.collection('expPortfolios').insertOne(expPortfolio);
                    }
                    if (idx === (portfolio.expPortfolios.length - 1)) {
                        resolve(true);
                    }
                });
            });
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
