import PocketBase from 'pocketbase';
import { POCKETBASE_URL } from '../../../app-config';

const PB = POCKETBASE_URL;

const pb = new PocketBase(`${PB}`);

export default pb;
