import { useState, useEffect } from "react";
import { Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Preferences {
  readingLevel: string;
  language: string;
}

interface PreferencesModalProps {
  language: string;
  onLanguageChange: (lang: string) => void;
}

const PreferencesModal = ({ language, onLanguageChange }: PreferencesModalProps) => {
  const [open, setOpen] = useState(false);
  const [preferences, setPreferences] = useState<Preferences>({
    readingLevel: "general",
    language: language,
  });

  useEffect(() => {
    const saved = localStorage.getItem("medease-preferences");
    if (saved) {
      const parsed = JSON.parse(saved);
      setPreferences(parsed);
      if (parsed.language) {
        onLanguageChange(parsed.language);
      }
    }
  }, []);

  const savePreferences = () => {
    localStorage.setItem("medease-preferences", JSON.stringify(preferences));
    onLanguageChange(preferences.language);
    setOpen(false);
  };

  const readingLevels = [
    { value: "simple", label: "Simple (Elementary)", description: "Basic vocabulary, short sentences" },
    { value: "general", label: "General (Middle School)", description: "Everyday language, clear explanations" },
    { value: "advanced", label: "Advanced (High School)", description: "More detail, some medical terms" },
    { value: "professional", label: "Professional", description: "Full medical terminology with explanations" },
  ];

  const languages = [
    { code: "en", label: "English" },
    { code: "es", label: "Español" },
    { code: "fr", label: "Français" },
    { code: "de", label: "Deutsch" },
    { code: "zh", label: "中文" },
    { code: "hi", label: "हिन्दी" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="fixed bottom-6 left-6 w-12 h-12 rounded-full shadow-card hover:shadow-card-hover z-40"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Preferences
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Reading Level */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Reading Level</Label>
            <p className="text-sm text-muted-foreground">
              Choose how medical information should be explained to you
            </p>
            <Select
              value={preferences.readingLevel}
              onValueChange={(value) =>
                setPreferences((prev) => ({ ...prev, readingLevel: value }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {readingLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    <div className="flex flex-col">
                      <span>{level.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {level.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Language */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Language</Label>
            <p className="text-sm text-muted-foreground">
              Your preferred language for explanations
            </p>
            <Select
              value={preferences.language}
              onValueChange={(value) =>
                setPreferences((prev) => ({ ...prev, language: value }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={savePreferences}>Save Preferences</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreferencesModal;
