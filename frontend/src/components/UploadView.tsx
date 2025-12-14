import { useState, useCallback } from "react";
import { Upload, FileText, Image, File, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadViewProps {
  onFileUpload: (file: File) => void;
}

const UploadView = ({ onFileUpload }: UploadViewProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        setUploadedFile(file);
        onFileUpload(file);
      }
    },
    [onFileUpload]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setUploadedFile(file);
        onFileUpload(file);
      }
    },
    [onFileUpload]
  );

  const getFileIcon = (file: File) => {
    if (file.type.includes("pdf")) return FileText;
    if (file.type.includes("image")) return Image;
    return File;
  };

  const demoSteps = [
    { step: 1, text: "Upload your medical document" },
    { step: 2, text: "View the simplified explanation" },
    { step: 3, text: "Ask questions via the chatbot" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] p-6 animate-fade-in">
      <div className="w-full max-w-2xl">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Upload Medical Document
          </h1>
          <p className="text-muted-foreground text-lg">
            Upload your medical documents to get simplified explanations
          </p>
        </div>

        {/* Demo Flow Steps */}
        <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
          {demoSteps.map((item, index) => (
            <div key={item.step} className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                  {item.step}
                </span>
                <span className="text-sm text-foreground">{item.text}</span>
              </div>
              {index < demoSteps.length - 1 && (
                <ArrowRight className="w-4 h-4 text-muted-foreground hidden sm:block" />
              )}
            </div>
          ))}
        </div>

        {/* Upload Card */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative bg-card rounded-2xl shadow-card transition-all duration-300 ${
            isDragging
              ? "border-2 border-primary border-dashed shadow-card-hover"
              : "border-2 border-dashed border-border"
          } ${uploadedFile ? "border-success" : ""}`}
        >
          <div className="p-12 flex flex-col items-center">
            {uploadedFile ? (
              <>
                <div className="w-20 h-20 rounded-full bg-success-soft flex items-center justify-center mb-6 animate-scale-in">
                  <CheckCircle className="w-10 h-10 text-success" />
                </div>
                <div className="flex items-center gap-3 mb-4 p-4 bg-secondary rounded-xl">
                  {(() => {
                    const Icon = getFileIcon(uploadedFile);
                    return <Icon className="w-6 h-6 text-primary" />;
                  })()}
                  <div>
                    <p className="font-medium text-foreground">
                      {uploadedFile.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <p className="text-success font-medium mb-6">
                  File uploaded successfully!
                </p>
                <Button
                  onClick={() => setUploadedFile(null)}
                  variant="outline"
                  className="rounded-xl"
                >
                  Upload Another File
                </Button>
              </>
            ) : (
              <>
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all duration-300 ${
                    isDragging ? "bg-primary-soft scale-110" : "bg-secondary"
                  }`}
                >
                  <Upload
                    className={`w-10 h-10 transition-colors duration-300 ${
                      isDragging ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                </div>

                <p className="text-lg font-medium text-foreground mb-2">
                  {isDragging
                    ? "Drop your file here"
                    : "Drag and drop your file here"}
                </p>
                <p className="text-muted-foreground mb-6">or</p>

                <label htmlFor="file-upload">
                  <input
                    id="file-upload"
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                  <Button
                    asChild
                    size="lg"
                    className="rounded-xl px-8 cursor-pointer text-base font-semibold"
                  >
                    <span>Choose File</span>
                  </Button>
                </label>

                <div className="flex items-center gap-4 mt-8 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>PDF</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-border" />
                  <div className="flex items-center gap-2">
                    <Image className="w-4 h-4" />
                    <span>PNG, JPG</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Trust indicators */}
        <div className="flex items-center justify-center gap-8 mt-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span>Secure & Private</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span>HIPAA Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span>Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadView;