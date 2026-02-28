import { Download, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";

interface MatchResultsProps {
  matches: string[];
  totalSheet1: number;
  totalSheet2: number;
}

const MatchResults = ({ matches, totalSheet1, totalSheet2 }: MatchResultsProps) => {
  const handleDownload = () => {
    const ws = XLSX.utils.aoa_to_sheet([["Matching Numbers"], ...matches.map((m) => [m])]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Matches");
    XLSX.writeFile(wb, "matching_numbers.xlsx");
  };

  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-10 animate-fade-in">
        <XCircle className="h-16 w-16 text-destructive/70" />
        <h3 className="text-xl font-heading font-semibold text-foreground">No Matches Found</h3>
        <p className="text-sm text-muted-foreground">
          Compared {totalSheet1} values from Sheet 1 with {totalSheet2} values from Sheet 2
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-success" />
          <h3 className="text-xl font-heading font-semibold text-foreground">
            {matches.length} Match{matches.length !== 1 ? "es" : ""} Found
          </h3>
        </div>
        <Button onClick={handleDownload} className="gap-2">
          <Download className="h-4 w-4" />
          Download
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        Compared {totalSheet1} from Sheet 1 × {totalSheet2} from Sheet 2
      </p>

      <div className="max-h-[300px] overflow-y-auto rounded-lg border border-border bg-muted/30">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-px bg-border">
          {matches.map((val, i) => (
            <div key={i} className="bg-card px-4 py-2.5 font-mono text-sm text-foreground">
              {val}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MatchResults;
