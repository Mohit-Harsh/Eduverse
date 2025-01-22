import { ipcMain, dialog, shell } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import { join } from 'path/posix';
import { DriveUploadManager } from './drive'


require('dotenv').config()
const credentials = {
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  redirect_uri: 'http://localhost'
}

const manager = new DriveUploadManager(credentials);

async function setupResourceOperations()
{
  ipcMain.handle('upload-file',async (event,req)=>{

    const resDir = join(req.dir,"Resources",req.id);

    if(!fs.existsSync(resDir))
    {
      fs.mkdirSync(resDir,{recursive:true});
    }

    if(req.data.type == 'link')
    {
      const shortcutPath = path.join(resDir, `${req.data.name}.url`);

      if(fs.existsSync(shortcutPath))
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

      const shortcutContent = `[InternetShortcut]\nURL=${req.data.link}`;

      fs.writeFileSync(shortcutPath, shortcutContent, (err) => {
          if (err) {
              dialog.showMessageBoxSync(null,{
                type:'error',
                title:'Failed to create desktop shortcut:',
                message:err
              });

              return {status:false};
          }
      });

    }
    else
    {
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
    }

    let data = await getResources(event,req);
      
    return {status:true,data:data};

  });

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
  );

  ipcMain.handle("open-file",(event,fullPath)=>{
    shell.openExternal(`file://${fullPath}`);
  });
  ipcMain.handle("open-link",(event,link)=>{
    shell.openExternal(link)
  })

  ipcMain.handle('upload-drive-file', async (event, req) => {
    try {
      if (!((await manager.loadUser()) && (await manager.checkAndRefreshTokens()))) {
        // Start auth flow if no valid tokens
        await manager.startAuthFlow()
      }

      const result = await manager.uploadFile(req)
      console.log(result)

      if (result.success) {
        dialog.showMessageBoxSync(null, {
          type: 'info',
          title: 'Uploaded',
          message: `${result.name} uploaded successfully`
        })
        return {
          status: true,
          fileId: result.fileId,
          name: result.name,
          shareableLink: result.shareableLink,
          type: result.type,
          size: result.size,
          date: result.date
        }
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      return {
        status: false,
        error: error.message
      }
    }
  });

}

export default setupResourceOperations;