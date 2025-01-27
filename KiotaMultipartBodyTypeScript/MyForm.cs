namespace KiotaMultipartBodyTypeScript;

public class MyForm
{
    public string Name { get; set; } = null!;
    public string? Comment { get; set; }
    public IFormFile MyFile { get; set; } = null!;
    public List<IFormFile> Attachments { get; set; } = [];
}