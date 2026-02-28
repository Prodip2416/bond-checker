import { useCallback, useRef, useState } from "react";
import { Upload, FileSpreadsheet, X } from "lucide-react";

interface FileDropZoneProps {
  label: string;
  file: File | null;
  onFileSelect: (file: File) => void;
  onClear: () => void;
}

const FileDropZone = ({ label, file, onFileSelect, onClear }: FileDropZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const f = e.dataTransfer.files[0];
      if (f) onFileSelect(f);
    },
    [onFileSelect]
  );

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => !file && inputRef.current?.click()}
      className={`relative flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 transition-all duration-300 cursor-pointer min-h-[180px] ${
        isDragging
          ? "border-primary bg-primary/10 scale-[1.02]"
          : file
          ? "border-accent bg-accent/5"
          : "border-border hover:border-primary/50 hover:bg-muted/50"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
      />
      {file ? (
        <>
          <FileSpreadsheet className="h-10 w-10 text-primary" />
          <span className="text-sm font-medium text-foreground truncate max-w-full">{file.name}</span>
          <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</span>
          <button
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            className="absolute top-3 right-3 p-1 rounded-full bg-muted hover:bg-destructive/20 transition-colors"
          >
            <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
          </button>
        </>
      ) : (
        <>
          <Upload className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground">Drag & drop or click to browse</p>
          <p className="text-xs text-muted-foreground">.xlsx, .xls, .csv</p>
        </>
      )}
    </div>
  );
};

export default FileDropZone;
