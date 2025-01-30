import './App.css'

import {
  AnonymousAuthenticationProvider,
  MultipartBody,
} from "@microsoft/kiota-abstractions";
import { FetchRequestAdapter } from "@microsoft/kiota-http-fetchlibrary";
import { createApiClient } from "./api/apiClient.js";

const authProvider = new AnonymousAuthenticationProvider();
const adapter = new FetchRequestAdapter(authProvider);
const client = createApiClient(adapter);

function App() {


  const processFilesToBytes = async (files:File[]) => {
    const buffers = await Promise.all(files.map(async (file, index) => {
      return { index, buffer: await file.bytes() };
    }));
  
    return buffers;
  };

  const formatMultipartNameWithFilename  = (name: string, fileName: string) => {
    return `${name}"; filename="${fileName}`;
  };
  
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name")?.toString() || "";
    const comment = formData.get("comment")?.toString() || "";
    const myFile = formData.get("myFile") as File;
    const attachments = Array.from(formData.getAll("attachments")) as File[];
  
    try {
      const multipartBody = new MultipartBody();
      
      multipartBody.addOrReplacePart("Name", "text/plain", name);
      multipartBody.addOrReplacePart("Comment", "text/plain", comment);  
      multipartBody.addOrReplacePart(formatMultipartNameWithFilename("MyFile", myFile.name), myFile.type || "application/octet-stream", await myFile.bytes());
      // multipartBody.addOrReplacePart(`MyFile\";filename=\"${myFile.name}`, myFile.type || "application/octet-stream", await myFile.arrayBuffer());
      
      const attachmentBuffers = await processFilesToBytes(attachments);
      attachmentBuffers.forEach(file =>
        multipartBody.addOrReplacePart(
          formatMultipartNameWithFilename(`Attachments[${file.index}]`, attachments[file.index].name),
            attachments[file.index].type || "application/octet-stream",
            file.buffer
        )
      );
  
      await client.handleForm.post(multipartBody); // SOS: Error while sending post: Error: unsupported content type for multipart body: object
    } catch (err) {
      console.error("Error while sending post:", err);
    }
  };

  return (
    <>
      <div>
          <h2>Form</h2>
          <form onSubmit={handleFormSubmit}>
            <label>
              Name:
              <input type="text" name="name" required />
            </label>
            <label>
              Comment:
              <input type="text" name="comment" />
            </label>
            <label>
              File:
              <input type="file" name="myFile" required />
            </label>
            <label>
              Attachments:
              <input type="file" name="attachments" multiple />
            </label>
            <button type="submit">Submit</button>
          </form>
      </div>
    </>
  )
}

export default App
