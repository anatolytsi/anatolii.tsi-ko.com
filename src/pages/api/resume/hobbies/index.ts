import nextConnect from 'next-connect';
import middleware from '@/middleware/resume-database';
import { attachGetList, attachPostList } from '@/utils/resume/api-helper';

const handler = nextConnect();

handler.use(middleware);

const COLLECTION = 'hobbies';

attachGetList(handler, COLLECTION);
attachPostList(handler, COLLECTION);

export default handler;
