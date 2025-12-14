import { Search, BookOpen } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const glossaryTerms = [
  {
    term: "Hypertension",
    definition: "High blood pressure. When the force of blood against your artery walls is consistently too high, which can lead to heart problems over time.",
    category: "Cardiovascular",
  },
  {
    term: "Hypoxemia",
    definition: "Low oxygen levels in your blood. This can make you feel short of breath or tired, and may require supplemental oxygen.",
    category: "Respiratory",
  },
  {
    term: "MRI",
    definition: "Magnetic Resonance Imaging. A scan that uses magnets and radio waves to take detailed pictures inside your body without radiation.",
    category: "Diagnostic",
  },
  {
    term: "Bronchodilator",
    definition: "Medicine that opens up your airways to make breathing easier. Often given through an inhaler for conditions like asthma or COPD.",
    category: "Medication",
  },
  {
    term: "Bilateral",
    definition: "Affecting both sides. When a doctor says something is bilateral, it means it appears on both sides of your body.",
    category: "General",
  },
  {
    term: "COPD",
    definition: "Chronic Obstructive Pulmonary Disease. A long-term lung condition that makes it hard to breathe, often caused by smoking.",
    category: "Respiratory",
  },
  {
    term: "Prognosis",
    definition: "The expected outcome or course of a disease. Your doctor's prediction about how your condition will develop.",
    category: "General",
  },
  {
    term: "Antibiotic",
    definition: "Medicine that fights bacterial infections. It does not work against viruses like the common cold or flu.",
    category: "Medication",
  },
  {
    term: "Benign",
    definition: "Not harmful or cancerous. A benign growth or condition is not dangerous and usually doesn't spread.",
    category: "General",
  },
  {
    term: "Acute",
    definition: "Sudden or severe. An acute condition comes on quickly and may need immediate attention, as opposed to chronic (long-lasting).",
    category: "General",
  },
  {
    term: "Arrhythmia",
    definition: "Irregular heartbeat. Your heart may beat too fast, too slow, or with an uneven rhythm.",
    category: "Cardiovascular",
  },
  {
    term: "Biopsy",
    definition: "A test where a small sample of tissue is taken from your body to be examined under a microscope.",
    category: "Diagnostic",
  },
];

const categoryColors: Record<string, string> = {
  Cardiovascular: "bg-destructive/10 text-destructive",
  Respiratory: "bg-primary/10 text-primary",
  Diagnostic: "bg-accent/10 text-accent",
  Medication: "bg-success/10 text-success",
  General: "bg-secondary text-secondary-foreground",
};

const GlossaryView = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTerms = glossaryTerms.filter(
    (item) =>
      item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Medical Glossary
          </h1>
          <p className="text-muted-foreground text-lg">
            Common medical terms explained in simple language
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search terms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-xl text-base"
            />
          </div>
        </div>

        {/* Terms Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTerms.map((item, index) => (
            <div
              key={item.term}
              className="bg-card rounded-xl shadow-card p-5 hover:shadow-card-hover transition-all duration-300 cursor-default group animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-foreground text-lg">
                    {item.term}
                  </h3>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    categoryColors[item.category] || categoryColors.General
                  }`}
                >
                  {item.category}
                </span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {item.definition}
              </p>
            </div>
          ))}
        </div>

        {filteredTerms.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No terms found matching "{searchQuery}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlossaryView;
