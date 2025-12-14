import { useState } from "react";
import { FileText, Sparkles, ChevronDown, ChevronUp, AlertCircle, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface GlossaryTerm {
  term: string;
  definition: string;
}

const inlineGlossary: GlossaryTerm[] = [
  { term: "COPD", definition: "Chronic Obstructive Pulmonary Disease — a long-term lung condition that makes it hard to breathe, often caused by smoking." },
  { term: "hypoxemia", definition: "Low oxygen levels in your blood. This can make you feel short of breath or tired." },
  { term: "pneumonia", definition: "A lung infection that inflames the air sacs, causing cough with phlegm, fever, and difficulty breathing." },
  { term: "respiratory acidosis", definition: "When your blood becomes too acidic because your lungs can't remove enough carbon dioxide." },
  { term: "bronchodilator", definition: "Medicine that opens up your airways to make breathing easier, often given through an inhaler." },
  { term: "SpO2", definition: "Blood oxygen saturation level — the percentage of oxygen in your blood. Normal is 95-100%." },
  { term: "bilateral infiltrates", definition: "Abnormal substances (like fluid or infection) seen on both sides of the lungs in an X-ray." },
  { term: "non-invasive positive pressure ventilation", definition: "Breathing support through a mask that helps push air into your lungs without surgery." },
];

const SimplifyView = () => {
  const [showAudit, setShowAudit] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null);

  const originalText = `Patient presents with acute exacerbation of chronic obstructive pulmonary disease (COPD) with evidence of hypoxemia. Chest X-ray reveals bilateral infiltrates consistent with pneumonia. Arterial blood gas analysis demonstrates respiratory acidosis with partial compensation. Recommend initiation of broad-spectrum antibiotics, bronchodilator therapy, and supplemental oxygen with target SpO2 94-98%. Consider non-invasive positive pressure ventilation if respiratory status deteriorates.`;

  const simplifiedText = `Your condition has worsened temporarily, making it harder to breathe normally.

What we found:
• Your lungs are showing signs of infection (pneumonia)
• Your blood oxygen levels are lower than they should be
• Your body is working harder to breathe

Our treatment plan:
• Antibiotics to fight the infection
• Inhaler medications to open your airways
• Extra oxygen to help you breathe easier

We'll monitor you closely, and if breathing becomes more difficult, we have additional breathing support available.`;

  const auditItems = [
    {
      original: "acute exacerbation of chronic obstructive pulmonary disease (COPD)",
      simplified: "your condition has worsened temporarily",
      reason: "Replaced medical jargon with everyday language",
    },
    {
      original: "hypoxemia",
      simplified: "lower blood oxygen levels",
      reason: "Translated clinical term to patient-friendly explanation",
    },
    {
      original: "bilateral infiltrates",
      simplified: "signs of infection (pneumonia)",
      reason: "Explained X-ray findings in understandable terms",
    },
    {
      original: "respiratory acidosis with partial compensation",
      simplified: "body is working harder to breathe",
      reason: "Simplified blood gas interpretation",
    },
  ];

  // Function to highlight medical terms in text
  const highlightTerms = (text: string) => {
    let result: (string | JSX.Element)[] = [text];
    
    inlineGlossary.forEach((glossaryItem) => {
      const newResult: (string | JSX.Element)[] = [];
      
      result.forEach((part) => {
        if (typeof part === "string") {
          const regex = new RegExp(`(${glossaryItem.term})`, "gi");
          const parts = part.split(regex);
          
          parts.forEach((p, i) => {
            if (p.toLowerCase() === glossaryItem.term.toLowerCase()) {
              newResult.push(
                <TooltipProvider key={`${glossaryItem.term}-${i}`}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setSelectedTerm(glossaryItem)}
                        className="text-primary underline decoration-dotted underline-offset-2 hover:decoration-solid cursor-help font-medium"
                      >
                        {p}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs bg-popover text-popover-foreground border border-border shadow-lg z-50">
                      <p className="text-sm">{glossaryItem.definition}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            } else if (p) {
              newResult.push(p);
            }
          });
        } else {
          newResult.push(part);
        }
      });
      
      result = newResult;
    });
    
    return result;
  };

  return (
    <div className="p-6 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Document Simplification
          </h1>
          <p className="text-muted-foreground text-lg">
            Your medical document translated into easy-to-understand language
          </p>
          <p className="text-sm text-primary mt-2">
            Click on underlined terms to see their definitions
          </p>
        </div>

        {/* Term Definition Modal */}
        {selectedTerm && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedTerm(null)}>
            <div 
              className="bg-card rounded-2xl shadow-float p-6 max-w-md w-full animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-foreground">{selectedTerm.term}</h3>
                <button
                  onClick={() => setSelectedTerm(null)}
                  className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <p className="text-muted-foreground leading-relaxed">{selectedTerm.definition}</p>
            </div>
          </div>
        )}

        {/* Side by side cards */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Original Document */}
          <div className="bg-card rounded-2xl shadow-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-card-muted flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                <FileText className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Original Document</h2>
                <p className="text-sm text-muted-foreground">Medical terminology — click terms for definitions</p>
              </div>
            </div>
            <div className="p-6">
              <p className="text-foreground leading-relaxed">
                {highlightTerms(originalText)}
              </p>
            </div>
          </div>

          {/* Simplified Explanation */}
          <div className="bg-card rounded-2xl shadow-card overflow-hidden border-2 border-primary/20">
            <div className="px-6 py-4 border-b border-primary/20 bg-primary-soft flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Simplified Explanation</h2>
                <p className="text-sm text-primary">Easy to understand</p>
              </div>
            </div>
            <div className="p-6">
              <p className="text-foreground leading-relaxed whitespace-pre-line">
                {simplifiedText}
              </p>
            </div>
          </div>
        </div>

        {/* What Changed Section */}
        <div className="bg-card rounded-2xl shadow-card overflow-hidden">
          <button
            onClick={() => setShowAudit(!showAudit)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-accent" />
              <span className="font-semibold text-foreground">What changed?</span>
              <span className="text-sm text-muted-foreground">
                ({auditItems.length} simplifications made)
              </span>
            </div>
            {showAudit ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </button>

          {showAudit && (
            <div className="px-6 pb-6 border-t border-border animate-fade-in">
              <div className="space-y-4 mt-4">
                {auditItems.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 bg-secondary rounded-xl animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="grid md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Original
                        </span>
                        <p className="text-sm text-foreground mt-1 line-through opacity-60">
                          {item.original}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-primary uppercase tracking-wide">
                          Simplified
                        </span>
                        <p className="text-sm text-foreground mt-1 font-medium">
                          {item.simplified}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Why:</span> {item.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimplifyView;