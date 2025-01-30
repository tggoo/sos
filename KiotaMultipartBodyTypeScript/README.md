# Kiota MultipartBody TypeScript

## Endpoint

Minimal API, `.NET 9`, simple endpoint which accepts, multipart form data.

```csharp
app.MapPost("/handle-form", async (HttpRequest request) =>
{
    IFormCollection form = await request.ReadFormAsync();

    MyForm myForm = new()
    {
        Name = form["Name"]!,
        Comment = form["Comment"],
        MyFile = form.Files["MyFile"]!,
        Attachments = [.. form.Files.Where(x => Regex.IsMatch(x.Name, @"^Attachments\[\d+\]$", RegexOptions.IgnoreCase))]
    };

    return Results.Ok(myForm);
})
.Accepts<MyForm>("multipart/form-data")
.DisableAntiforgery();
```

## OpenAPI Specification

> [openApi.json](./OpenApiSpecification.json)

Path:
```json
"/handle-form": {
"post": {
  "tags": [
    "KiotaMultipartBodyTypeScript"
  ],
  "requestBody": {
    "content": {
      "multipart/form-data": {
        "schema": {
          "$ref": "#/components/schemas/MyForm"
        }
      }
    },
    "required": true
  },
  "responses": {
    "200": {
      "description": "OK"
    }
  }
}
}
```

Schemas:

```json
"IFormFile": {
  "type": "string",
  "format": "binary"
},
"MyForm": {
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "comment": {
      "type": "string",
      "nullable": true
    },
    "myFile": {
      "$ref": "#/components/schemas/IFormFile"
    },
    "attachments": {
      "type": "array",
      "items": {
        "$ref": "#/components/schemas/IFormFile"
      }
    }
  }
}
```

### Calling API from `scalar`

Endpoint works well.

Request

```dylan
-----------------------------18338616785866921023496902631
Content-Disposition: form-data; name="name"

Barry Allen
-----------------------------18338616785866921023496902631
Content-Disposition: form-data; name="comment"

Speedster
-----------------------------18338616785866921023496902631
Content-Disposition: form-data; name="myFile"; filename="random3.dat"
Content-Type: application/octet-stream

... some bytes ...
-----------------------------18338616785866921023496902631
Content-Disposition: form-data; name="attachments[0]"; filename="Text.txt"
Content-Type: text/plain

Hello!!
-----------------------------18338616785866921023496902631
Content-Disposition: form-data; name="attachments[1]"; filename="random2.dat"
Content-Type: application/octet-stream

... some bytes ...
-----------------------------18338616785866921023496902631
Content-Disposition: form-data; name="attachments[2]"; filename="random1.dat"
Content-Type: application/octet-stream

... some bytes ...
-----------------------------18338616785866921023496902631--
```

Response

```json
{
  "name": "Barry Allen",
  "comment": "Speedster",
  "myFile": {
    "contentType": "application/octet-stream",
    "contentDisposition": "form-data; name=\"myFile\"; filename=\"random3.dat\"",
    "headers": {
      "Content-Disposition": [
        "form-data; name=\"myFile\"; filename=\"random3.dat\""
      ],
      "Content-Type": [
        "application/octet-stream"
      ]
    },
    "length": 2000,
    "name": "myFile",
    "fileName": "random3.dat"
  },
  "attachments": [
    {
      "contentType": "text/plain",
      "contentDisposition": "form-data; name=\"attachments[0]\"; filename=\"Text.txt\"",
      "headers": {
        "Content-Disposition": [
          "form-data; name=\"attachments[0]\"; filename=\"Text.txt\""
        ],
        "Content-Type": [
          "text/plain"
        ]
      },
      "length": 7,
      "name": "attachments[0]",
      "fileName": "Text.txt"
    },
    {
      "contentType": "application/octet-stream",
      "contentDisposition": "form-data; name=\"attachments[1]\"; filename=\"random2.dat\"",
      "headers": {
        "Content-Disposition": [
          "form-data; name=\"attachments[1]\"; filename=\"random2.dat\""
        ],
        "Content-Type": [
          "application/octet-stream"
        ]
      },
      "length": 800,
      "name": "attachments[1]",
      "fileName": "random2.dat"
    },
    {
      "contentType": "application/octet-stream",
      "contentDisposition": "form-data; name=\"attachments[2]\"; filename=\"random1.dat\"",
      "headers": {
        "Content-Disposition": [
          "form-data; name=\"attachments[2]\"; filename=\"random1.dat\""
        ],
        "Content-Type": [
          "application/octet-stream"
        ]
      },
      "length": 1024,
      "name": "attachments[2]",
      "fileName": "random1.dat"
    }
  ]
}
```

## Kiota:

```bash
kiota --version
1.22.3+a544276a5ee9d4a7b67cc0fbd5ce2804c172fa14
```

## Frontend typescript

```bash

# new project
npm create vite@latest Frontend -- --template react-ts

# Kiota packages
npm install @microsoft/kiota-bundle @microsoft/kiota-serialization-json @microsoft/kiota-serialization-multipart

# "@microsoft/kiota-bundle": "^1.0.0-preview.80"
# "@microsoft/kiota-serialization-json": "^1.0.0-preview.80"
# "@microsoft/kiota-serialization-multipart": "^1.0.0-preview.80"

```

### Client

```bash
# cd Frontend
kiota generate --openapi http://localhost:5187/openapi/v1.json --language typescript -o src/api -c apiClient
```

### Generated

```typescript
/**
* @param body The request body
* @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
* @returns {Promise<ArrayBuffer>}
*/
post(body: MultipartBody, requestConfiguration?: RequestConfiguration<object> | undefined) : Promise<ArrayBuffer | undefined>;
```

### Handle form submit

```typescript
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
```

## Solution

> [Kiota MultiparBody Serializer](https://github.com/microsoft/kiota-typescript/blob/eb2414da1251ca627059ee40169e9fd20368cd9f/packages/abstractions/src/multipartBody.ts#L132)

```typescript
- multipartBody.addOrReplacePart("MyFile", "application/octet-stream", myFile);
+ multipartBody.addOrReplacePart("MyFile", "application/octet-stream", await myFile.bytes());

// or
+ multipartBody.addOrReplacePart("MyFile", "application/octet-stream", await myFile.arrayBuffer());
```
