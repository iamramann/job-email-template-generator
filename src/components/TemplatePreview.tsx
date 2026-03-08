import { Check, Copy, Download, Mail } from "lucide-react";
import React, { useState } from "react";

interface TemplatePreviewProps {
  content: string;
  templateName: string;
}

function parseEmailParts(content: string): { subject: string; body: string } {
  const subjectMatch = content.match(/^Subject:\s*(.+?)(?:\n|$)/im);
  if (subjectMatch) {
    const subject = subjectMatch[1].trim();
    const body = content.replace(/^Subject:.*\n?/im, '').trim();
    return { subject, body };
  }
  const lines = content.split('\n');
  const firstLine = lines[0]?.trim() ?? '';
  if (firstLine.length > 0 && firstLine.length < 120 && lines.length > 1) {
    return { subject: firstLine, body: lines.slice(1).join('\n').trim() };
  }
  return { subject: '', body: content };
}

function useCopyToast() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      /* ignore */
    }
  };
  return { copied, copy };
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  content,
  templateName,
}) => {
  const { subject, body } = parseEmailParts(content);
  const { copied, copy } = useCopyToast();

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${templateName.toLowerCase().replace(/\s+/g, "-")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!content) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gray-800 flex items-center justify-center">
          <Mail className="w-5 h-5 text-gray-600" />
        </div>
        <p className="text-gray-600 text-sm text-center">Fill in the fields to see<br />your email preview here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Preview</p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => copy(content, 'all')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-colors"
          >
            {copied === 'all' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied === 'all' ? 'Copied!' : 'Copy All'}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-300 text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            .txt
          </button>
        </div>
      </div>

      {/* Email card */}
      <div className="bg-gray-800/40 border border-gray-700 rounded-2xl overflow-hidden">
        {/* Subject row */}
        {subject ? (
          <div className="flex items-start gap-3 px-4 py-3 border-b border-gray-700 group">
            <div className="flex-1 min-w-0">
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-0.5">Subject</p>
              <p className="text-white text-sm font-medium leading-snug">{subject}</p>
            </div>
            <button
              onClick={() => copy(subject, 'subject')}
              className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-gray-200 text-xs font-medium transition-all opacity-0 group-hover:opacity-100"
            >
              {copied === 'subject' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copied === 'subject' ? 'Copied' : 'Copy'}
            </button>
          </div>
        ) : null}

        {/* Body row */}
        <div className="group">
          <div className="flex items-start justify-between px-4 pt-3 pb-1">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Body</p>
            <button
              onClick={() => copy(body || content, 'body')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-gray-200 text-xs font-medium transition-all opacity-0 group-hover:opacity-100"
            >
              {copied === 'body' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copied === 'body' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="px-4 pb-4 max-h-[400px] overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm text-gray-300 font-sans leading-relaxed">
              {body || content}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
