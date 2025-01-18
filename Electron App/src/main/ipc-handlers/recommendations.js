import { ipcMain, dialog } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import { join } from 'path/posix';
import bingScrape from '../webscrape/bingScrape';

function setupRecommendations()
{
    const dirPath = path.join(process.env.APPDATA, 'Eduverse');
    const cachePath = path.join(dirPath, "cache.json");

    ipcMain.handle('handle-resource-recommendations',async (event,query)=>{
        try{
            let rescache = fs.readFileSync(cachePath);
            rescache = JSON.parse(rescache);
            if(!Object.keys(rescache).includes(query))
            {
                const res = await bingScrape(query);
                rescache[query] = res;
                fs.writeFileSync(cachePath,JSON.stringify(rescache),'utf-8');
                console.log("Fetched recommendations");
                return res;
            }
            else
            {
                console.log("Returned recommendation cache");
                return rescache[query];
            }
        }
        catch(err)
        {
            dialog.showMessageBoxSync(null,{
                type:'error',
                title:"Error while fetching recommendations",
                message:err.message,
            });

            return [];
        }

    })
}

export default setupRecommendations;