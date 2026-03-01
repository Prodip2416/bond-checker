import { useState } from "react";
import * as XLSX from "xlsx";
import { ArrowRightLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import FileDropZone from "@/components/FileDropZone";
import MatchResults from "@/components/MatchResults";
import heroBg from "@/assets/hero-bg.jpg";

const readColumn = (file: File): Promise<string[]> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target?.result, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data: unknown[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });
        const values = data
          .map((row) => String(row[0] ?? "").trim())
          .filter((v) => v.length > 0);
        resolve(values);
      } catch {
        reject(new Error("Could not read file"));
      }
    };
    reader.readAsArrayBuffer(file);
  });

const Index = () => {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [matches, setMatches] = useState<string[] | null>(null);
  const [counts, setCounts] = useState({ s1: 0, s2: 0 });
  const [loading, setLoading] = useState(false);

  const handleCompare = async () => {
    if (!file1 || !file2) return;
    setLoading(true);
    try {
      const [col1, col2] = await Promise.all([readColumn(file1), readColumn(file2)]);
      const set2 = new Set(col2);
      const found = col1.filter((v) => set2.has(v));
      setMatches([...new Set(found)]);
      setCounts({ s1: col1.length, s2: col2.length });
    } catch {
      setMatches([]);
    }
    setLoading(false);
  };

  const reset = () => {
    setFile1(null);
    setFile2(null);
    setMatches(null);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-border">
        <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="relative z-10 flex flex-col items-center gap-4 py-16 px-4 text-center">
          <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-primary">Excel Sheet Matcher</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground tracking-tight">
            Bangladesh Price Bond
          </h1>
          <p className="max-w-md text-muted-foreground">
            Upload two Excel sheets, find matching numbers instantly, and download the results.
          </p>
        </div>
      </div>

      {/* Main */}
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <FileDropZone label="Sheet 1" file={file1} onFileSelect={setFile1} onClear={() => setFile1(null)} />
          <FileDropZone label="Sheet 2" file={file2} onFileSelect={setFile2} onClear={() => setFile2(null)} />
        </div>

        <div className="flex justify-center gap-4">
          <Button
            size="lg"
            onClick={handleCompare}
            disabled={!file1 || !file2 || loading}
            className="gap-2 animate-pulse-glow"
          >
            <ArrowRightLeft className="h-4 w-4" />
            {loading ? "Comparing…" : "Find Matches"}
          </Button>
          {matches !== null && (
            <Button size="lg" variant="outline" onClick={reset}>
              Reset
            </Button>
          )}
        </div>

        {matches !== null && (
          <div className="mt-10 rounded-xl border border-border bg-card p-6">
            <MatchResults matches={matches} totalSheet1={counts.s1} totalSheet2={counts.s2} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
