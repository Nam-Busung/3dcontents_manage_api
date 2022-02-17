# 3dcontents_manage_api

This project services APIs which can CRUD 3d contents information.<br/>
To call APIs, you need to have jwt which can be acquired on initial login.<br/>
Some APIs need specific authority to access them.<br/>

to run
1. npm install
2. npm run start
-> ContentManageDB.json file will be made and test user 1(artist),2(editor),3(client) will be added to it.


to test<br/>(before test, delete 'ContentManageDB.json' or modify config.js file to create new json file with different name)
1. npm run test:watch
