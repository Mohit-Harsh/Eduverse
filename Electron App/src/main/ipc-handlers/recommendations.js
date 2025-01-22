import { ipcMain, dialog } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import { join } from 'path/posix';
import bingScrape from '../webscrape/bingScrape';

function setupRecommendations(openai)
{
    const dirPath = path.join(process.env.APPDATA, 'Eduverse');
    const cachePath = path.join(dirPath, "cache.json");

    async function airecom(name,description,goal,prior_knowledge)
    {
        const completion = await openai.chat.completions.create({model: "gpt-4o-mini",
            messages: [
                {"role": "system", "content": "You are a helpful AI Assistant. Your job is to recommend study resources such as guides, tutorials, courses etc. that can help the student improve their skills on the given subject."},
                {
                    "role": "user",
                    "content": `<subject> ${name} </subject>
                    <description> ${description} </description>
                    <Goal>${goal}</Goal>
                    <Prior Knowledge>${prior_knowledge}</Prior Knowledge>

                    Consider student's goal's and prior knowledge before recommending study resources.

                    Give your response in the following JSON format:

                    {
                        "response": [ {"name":"Name of the resource","type":"type of the resource"}, ... upto 5 such resources ]
                    }`
                }
                ],
            response_format:{"type":"json_object"}
        });
            
        const res = JSON.parse(completion.choices[0].message.content);
        return res;
    }

    ipcMain.handle('handle-resource-recommendations',async (event,query)=>{

        let rescache = fs.readFileSync(cachePath);
        rescache = JSON.parse(rescache);

        try{  
            if(!Object.keys(rescache).includes(query))
            {
                let response = await airecom(query,"Theoretical knowledge and practical applications","No prior knowledge");
                response = response['response'];
                  
                const res = await bingScrape(response);
                    
                rescache[query] = res;

                fs.writeFileSync(cachePath,JSON.stringify(rescache),'utf-8');

                return res;
            }
            else
            {
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