import { ipcMain, dialog, shell } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import { join } from 'path/posix';

function setupResourceOperations()
{
    ipcMain.handle('upload-file',async (event,req)=>{

    const resDir = join(req.dir,"Resources",req.id);

    if(!fs.existsSync(resDir))
    {
      fs.mkdirSync(resDir,{recursive:true});
    }

    let newFilePath = `${req.data.name}${path.extname(req.data.location)}`

    if(fs.existsSync(newFilePath))
    {
      const response = await dialog.showMessageBoxSync(null,{
        type: 'question',
        buttons: ['No','Yes'],
        defaultId: 0,
        title: 'File Already Exists',
        message: 'A file with the same name already exists. Do you want to replace it?'
      });
      if(response == false)
      {
        return {status:false};
      }
    }
    
    fs.copyFileSync(req.data.location,join(resDir,newFilePath),null,(err)=>{

      if(err)
      {
        dialog.showMessageBoxSync(null,{
          type:'error',
          title:'Error',
          message:err,
        })
        return {status:false};
      }

    });

    let data = await getResources(event,req);
    
    return {status:true,data:data};

  })

  async function getResources(event,req)
  {
    let resDir = join(req.dir,"Resources",req.id);

    if(!fs.existsSync(resDir))
    {
      fs.mkdirSync(resDir,{recursive:true});
    }

    const files = fs.readdirSync(resDir);
    const fileDetails = files.map((file) => {
        const fullPath = path.join(resDir, file);
        const stats = fs.statSync(fullPath);

        return {
            name: file,
            type: path.extname(file),
            date: stats.mtime,
            size: stats.size,
            path:fullPath
        };
    });

    return fileDetails;
  }

  ipcMain.handle("get-resources",getResources);

  ipcMain.handle("delete-resource",(event,file)=>{

      let confirmation = dialog.showMessageBoxSync(null,{
        type: 'question',
        buttons: ['No', 'Yes'],
        defaultId: 0,
        title: 'Delete Resource?',
        message: 'Are you sure you want to delete this resource?'
      })

      if(confirmation)
      {
        try
        {
          fs.rmSync(file.path);
        }
        catch
        {
          dialog.showMessageBoxSync(null,{
            type:'error',
            title:"Error",
            message:"An unexpected error occured while deleting the file."
          })
          return false;
        }
        dialog.showMessageBoxSync(null,{
          type:'info',
          title:"Deleted",
          message:`${file.name} deleted successfully`
        })
        return true;
      }
      return false;
    }
  )

  ipcMain.handle("open-file",(event,fullPath)=>{
    shell.openExternal(`file://${fullPath}`);
  })
}

export default setupResourceOperations;