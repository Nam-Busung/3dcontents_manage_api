import {JsonDB} from "node-json-db";
import {Config} from "node-json-db/dist/lib/JsonDBConfig";

export const SECRET = 'apple';


export const db = new JsonDB(new Config("ContentManageDB", true, false, '/'));

//test db
// export const db = new JsonDB(new Config("testManageDB", true, false, '/'));
