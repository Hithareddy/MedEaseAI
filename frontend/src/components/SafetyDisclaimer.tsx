import { ShieldCheck } from "lucide-react";

const SafetyDisclaimer = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-secondary/80 backdrop-blur-sm border-t border-border py-2 px-4 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <p className="text-xs text-muted-foreground text-center">
          This tool explains medical documents. It does not provide medical advice. Always consult your healthcare provider.
        </p>
      </div>
    </div>
  );
};

export default SafetyDisclaimer;