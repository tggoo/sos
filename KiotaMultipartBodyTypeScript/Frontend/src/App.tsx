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

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
  
    // get form fields
    const name = formData.get("name")?.toString() || "";
    const comment = formData.get("comment")?.toString() || "";
    const myFile = formData.get("myFile") as File;
    const attachments = Array.from(formData.getAll("attachments")) as File[];
  
    try {
      const multipartBody = new MultipartBody();
      
      multipartBody.addOrReplacePart("Name", "application/x-www-form-urlencoded", name);
      multipartBody.addOrReplacePart("Comment", "application/x-www-form-urlencoded", comment);      
      multipartBody.addOrReplacePart("MyFile", "application/octet-stream", myFile);
      attachments.forEach((file, index) => {
        multipartBody.addOrReplacePart(`Attachments[${index}]`, "application/octet-stream", file);
      });
  
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
