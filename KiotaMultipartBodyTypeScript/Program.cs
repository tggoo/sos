using KiotaMultipartBodyTypeScript;

using Microsoft.AspNetCore.Mvc;

using Scalar.AspNetCore;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

{
    builder.Services.AddOpenApi();
    builder.Services.AddAntiforgery();
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowAll", builder =>
        {
            builder.AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader();
        });
    });
}

WebApplication app = builder.Build();

{
    app.MapOpenApi(); // https://localhost:5187/openapi/v1.json
    app.MapScalarApiReference(options => options.DefaultFonts = false); // route `https://localhost:5187/scalar/v1`
    app.UseAntiforgery();
    app.UseCors("AllowAll");
}

app.MapGet("/", context =>
{
    context.Response.Redirect("/scalar/v1");
    return Task.CompletedTask;
});

app.MapPost("/handle-form", async ([FromForm] MyForm myForm, HttpRequest request) =>
{   
    // IFormCollection form = await request.ReadFormAsync();
    // MyForm myForm = new()
    // {
    //     Name = form["Name"]!,
    //     Comment = form["Comment"],
    //     MyFile = form.Files["MyFile"]!,
    //     Attachments = [.. form.Files.Where(x => Regex.IsMatch(x.Name, @"^Attachments\[\d+\]$", RegexOptions.IgnoreCase))]
    // };
    
    await Task.CompletedTask;
    return Results.Ok(myForm);
})
.Accepts<MyForm>("multipart/form-data")
.DisableAntiforgery();

app.Run();