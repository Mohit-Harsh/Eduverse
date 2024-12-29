from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload, MediaIoBaseDownload
import io
from google_auth_oauthlib.flow import InstalledAppFlow
from fastapi import FastAPI
from pydantic import BaseModel
import json


app = FastAPI()

SCOPES = ['https://www.googleapis.com/auth/drive']

flow = InstalledAppFlow.from_client_secrets_file("../credentials_desktop.json",scopes=SCOPES)

credentials = flow.run_local_server(port=0)


class CreateFolder(BaseModel):

    folder_name: str
    parent_id: str

@app.get("/folder/create")
def createFolder(folder: CreateFolder):

    """Create a folder in Google Drive.

    Args:
        folder_name (str): The name of the folder to create.
        parent_id (str, optional): The ID of the parent folder. If None, creates the folder in root.

    Returns:
        str: The ID of the created folder.
    """
    file_metadata = {
        'name': folder.folder_name,
        'mimeType': 'application/vnd.google-apps.folder',
    }

    if folder.parent_id:
        file_metadata['parents'] = [folder.parent_id]

    folder = service.files().create(body=file_metadata, fields='id').execute()

    return folder.get('id')

@app.get("/folder/list/{folder_id}")
def list_files(folder_id:str):

    """List All Files in the Folder and return the ids and names"""
    
    query = f"'{folder_id}' in parents"
    results = service.files().list(q=query, fields="files(id, name)").execute()
    files = results.get('files', [])
    print("Files in the folder:")
    for file in files:
        print(f"Name: {file['name']}, ID: {file['id']}")
    return files

@app.get('/read/{file_id}')
def read_file(file_id:str):

    "Reading a file using file id"

    request = service.files().get_media(fileId=file_id)
    file_stream = io.BytesIO()
    downloader = MediaIoBaseDownload(file_stream, request)

    done = False
    while not done:
        status, done = downloader.next_chunk()
        print(f"Download progress: {int(status.progress() * 100)}%")

    # Parse the JSON content
    file_stream.seek(0)
    json_data = json.load(file_stream)

    return json_data

if __name__ == "__main__":
    # Example usage
    print("Listing files in Google Drive:")
    list_files()
