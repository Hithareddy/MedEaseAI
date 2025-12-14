import { useState } from "react";
import { Minus, List, FileText, ChevronDown, ChevronUp, Info } from "lucide-react";

type SummaryType = "oneline" | "bullets" | "detailed";

const SummariesView = () => {
  const [activeType, setActiveType] = useState<SummaryType>("bullets");
  const [showAudit, setShowAudit] = useState(false);

  const summaryTypes = [
    { id: "oneline" as SummaryType, label: "One-line", icon: Minus },
    { id: "bullets" as SummaryType, label: "Bullet Points", icon: List },
    { id: "detailed" as SummaryType, label: "Detailed", icon: FileText },
  ];

  const summaries: Record<SummaryType, React.ReactNode> = {
    oneline: (
      <p className="text-lg text-foreground">
        You have a lung infection that's making breathing harder, and we're treating it with antibiotics and breathing support.
      </p>
    ),
    bullets: (
      <ul className="space-y-3">
        <li className="flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
          <span className="text-foreground">Your COPD symptoms have temporarily worsened</span>
        </li>
        <li className="flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
          <span className="text-foreground">Chest X-ray shows signs of pneumonia in both lungs</span>
        </li>
        <li className="flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
          <span className="text-foreground">Blood oxygen levels are lower than normal</span>
        </li>
        <li className="flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
          <span className="text-foreground">Treatment includes antibiotics and inhaler medications</span>
        </li>
        <li className="flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
          <span className="text-foreground">You'll receive extra oxygen to help you breathe</span>
        </li>
        <li className="flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
          <span className="text-foreground">We'll monitor closely and can provide additional support if needed</span>
        </li>
      </ul>
    ),
    detailed: (
      <div className="space-y-6">
        <div>
          <h4 className="font-semibold text-foreground mb-2">What's Happening</h4>
          <p className="text-muted-foreground leading-relaxed">
            Your chronic lung condition (COPD) has experienced what doctors call an "acute exacerbation" — 
            essentially a temporary worsening of your symptoms. On top of this, your chest X-ray reveals 
            that you've developed pneumonia, an infection affecting both lungs.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-2">Current Status</h4>
          <p className="text-muted-foreground leading-relaxed">
            Your blood tests show that your oxygen levels are lower than they should be, and your body 
            is working harder to maintain proper breathing. This is a common response to lung infections 
            and is something we can treat effectively.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-2">Treatment Plan</h4>
          <p className="text-muted-foreground leading-relaxed">
            We're starting you on a combination of treatments: broad-spectrum antibiotics to fight the 
            infection, bronchodilator medications (delivered through an inhaler) to help open your airways, 
            and supplemental oxygen to ensure your body gets the oxygen it needs. We'll be aiming to keep 
            your oxygen levels between 94-98%.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-2">What to Expect</h4>
          <p className="text-muted-foreground leading-relaxed">
            We'll be monitoring you closely throughout your treatment. If your breathing becomes more 
            difficult despite these treatments, we have additional options available, including a special 
            breathing machine (non-invasive ventilation) that can help support your breathing without 
            requiring a breathing tube.
          </p>
        </div>
      </div>
    ),
  };

  const auditInfo = {
    original: "15 complex medical terms",
    simplified: "Plain language explanation",
    readingLevel: "6th grade level",
    accuracy: "Verified by medical AI",
  };

  return (
    <div className="p-6 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Document Summary
          </h1>
          <p className="text-muted-foreground text-lg">
            Choose how you'd like to see your document summary
          </p>
        </div>

        {/* Summary Type Selector */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-secondary rounded-xl p-1">
            {summaryTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setActiveType(type.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeType === type.id
                    ? "bg-card text-foreground shadow-card"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <type.icon className="w-4 h-4" />
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-card rounded-2xl shadow-card overflow-hidden mb-6">
          <div className="p-8">
            <div className="animate-fade-in" key={activeType}>
              {summaries[activeType]}
            </div>
          </div>
        </div>

        {/* Audit Section */}
        <div className="bg-card rounded-2xl shadow-card overflow-hidden">
          <button
            onClick={() => setShowAudit(!showAudit)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-accent" />
              <span className="font-semibold text-foreground">Summary Information</span>
            </div>
            {showAudit ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </button>

          {showAudit && (
            <div className="px-6 pb-6 border-t border-border animate-fade-in">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <div className="p-4 bg-secondary rounded-xl">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                    Original Complexity
                  </p>
                  <p className="text-foreground font-medium">{auditInfo.original}</p>
                </div>
                <div className="p-4 bg-secondary rounded-xl">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                    Output
                  </p>
                  <p className="text-foreground font-medium">{auditInfo.simplified}</p>
                </div>
                <div className="p-4 bg-secondary rounded-xl">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                    Reading Level
                  </p>
                  <p className="text-foreground font-medium">{auditInfo.readingLevel}</p>
                </div>
                <div className="p-4 bg-secondary rounded-xl">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                    Verification
                  </p>
                  <p className="text-foreground font-medium">{auditInfo.accuracy}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummariesView;
