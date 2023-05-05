import nextConnect from 'next-connect';
import middleware from '@/middleware/resume-database';
import { attachDelete, attachGet, attachPost } from '@/utils/resume/api-helper';

const handler = nextConnect();

handler.use(middleware);

const COLLECTION = 'languages';

attachGet(handler, COLLECTION);
attachPost(handler, COLLECTION);
attachDelete(handler, COLLECTION);

export default handler;
