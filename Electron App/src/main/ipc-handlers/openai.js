import OpenAI from 'openai'
import { dialog, ipcMain } from 'electron'
import { v1 } from 'uuid'

async function setupOpenAI() {
  const openai = new OpenAI()

  let syllabus = 'Embedded System Design'

  // ipcMain.handle("get-ai-roadmap",async (event,syllabus)=>{

  //     try{
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are a helpful AI assistant. Your task is to generate a course roadmap from the given context and return the result as a JSON object.'
      },
      {
        role: 'user',
        content: `
                    <Context>
                        ${syllabus}
                    </Context>
                    
                    From the above course syllabus generate a roadmap and give your response as the following JSON object:

                    [{
                        Module: Module Name
                        Topics: {"Easy":[List of easy difficulty topics in the module],"Medium":[List of medium difficulty topics],"Hard":[List of hard difficulty topics]}

                    },... repeat this for each module in the course.]`
      }
    ],
    response_format: { type: 'json_object' }
  })

  let airoadmap = JSON.parse(completion.choices[0].message.content)

  // airoadmap.forEach(module => {

  //     module["mid"] = v1();

  //     module["Progress"]=0;

  // });

  return airoadmap
  //     }
  //     catch(err)
  //     {
  //         dialog.showMessageBoxSync(null,{
  //             type:'error',
  //             title:'Error Generating AI Roadmap',
  //             message:err.message
  //         });
  //         return null;
  //     }
  // })
}

export default setupOpenAI
