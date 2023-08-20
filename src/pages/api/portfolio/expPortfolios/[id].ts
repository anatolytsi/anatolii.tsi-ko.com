import nextConnect from 'next-connect';
import middleware from '@/middleware/resume-database';
import { attachPost, attachGet } from '@/utils/resume/api-helper';

const handler = nextConnect();

handler.use(middleware);

const COLLECTION = 'expPortfolios';

attachGet(handler, COLLECTION);
attachPost(handler, COLLECTION);

export default handler;
