import OpenAI from "openai";
import { dialog, ipcMain } from "electron";
import { v1 } from "uuid";

async function setupOpenAI()
{
    
    const openai = new OpenAI();

    let syllabus = "Embedded System Design";

    ipcMain.handle("create-ai-roadmap",async (event,syllabus)=>{

        try{
            const completion = await openai.chat.completions.create({model: "gpt-4o-mini",
            messages: [
                {"role": "system", "content": "You are a helpful AI assistant. Your task is to generate a course roadmap from the given context and return the result as a JSON object."},
                {
                    "role": "user",
                    "content": `
                    <Context>
                        ${syllabus}
                    </Context>
                    
                    From the above course syllabus generate a roadmap and give your response as the following JSON object:

                    {"roadmap":
                        [{
                            Module: Module Name
                            Topics: {
                                
                                "Easy":[List of easy difficulty topics],
                                "Medium":[List of medium difficulty topics],
                                "Hard":[List of hard difficulty topics]}

                        },... repeat this for each module in the course.]
                    }`
                }
                ],
            response_format:{"type":"json_object"}
            });

            let res = JSON.parse(completion.choices[0].message.content);

            let airoadmap = res["roadmap"];

            for(let i=0;i<airoadmap.length;i++)
            {
                let module = airoadmap[i];

                module["mid"] = v1();
                
                module["Progress"]=0;

                let easy = [];
                let med = [];
                let hard = [];

                module["Topics"]["Easy"].forEach(element => {
                    easy.push({"tid":v1(),"title":element,"status":"not-started"});
                });
                module["Topics"]["Medium"].forEach(element => {
                    med.push({"tid":v1(),"title":element,"status":"not-started"});
                });
                module["Topics"]["Hard"].forEach(element => {
                    hard.push({"tid":v1(),"title":element,"status":"not-started"});
                });

                module["Topics"]["Easy"] = easy;
                module["Topics"]["Medium"] = med;
                module["Topics"]["Hard"] = hard;

                airoadmap[i] = module;
            }

            return airoadmap;
        }
        catch(err)
        {
            dialog.showMessageBoxSync(null,{
                type:'error',
                title:'Error Generating AI Roadmap',
                message:err.message
            });
            return [];
        }
    })
    
}

export default setupOpenAI;