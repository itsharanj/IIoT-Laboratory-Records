import { useState } from 'react';
import { motion } from 'motion/react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export const CodeBlock = ({ code, language = 'cpp', filename }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const lines = code.trim().split('\n');

  return (
    <div className="rounded-2xl overflow-hidden bg-[#1c1c1e] text-slate-100 my-4 shadow-md border border-white/10">
      {/* macOS Window Titlebar Header with Traffic Lights */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#2c2c2e] border-b border-white/5 text-xs select-none">
        <div className="flex items-center gap-3">
          {/* macOS Traffic Lights */}
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]/50" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]/50" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]/50" />
          </div>

          <div className="flex items-center gap-2 font-mono text-slate-300 ml-1">
            <span className="font-semibold text-white/90">{filename || `program.${language}`}</span>
            <span className="text-white/30">·</span>
            <span className="text-white/50 uppercase tracking-wider text-[10px]">{language}</span>
          </div>
        </div>

        <motion.button
          type="button"
          onClick={handleCopy}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 450, damping: 22 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-white/80 hover:text-white bg-white/10 hover:bg-white/15 active:bg-white/20 rounded-lg transition-colors cursor-pointer"
          title="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#34c759]" />
              <span className="text-[#34c759] font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-white/70" />
              <span>Copy</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Code Content with Line Numbers */}
      <div className="overflow-x-auto max-h-[500px] p-4 text-[13px] leading-relaxed font-mono custom-scrollbar">
        <pre className="table w-full">
          {lines.map((line, idx) => {
            return (
              <div key={idx} className="table-row hover:bg-white/[0.03]">
                <span className="table-cell select-none text-right pr-4 text-white/25 text-xs border-r border-white/10 w-10">
                  {idx + 1}
                </span>
                <span className="table-cell pl-4 text-white/90 whitespace-pre">
                  {highlightSyntax(line, language)}
                </span>
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
};

/**
 * Clean regex-based code syntax styling
 */
function highlightSyntax(line: string, _lang: string) {
  // Comments
  if (line.trim().startsWith('//') || line.trim().startsWith('#')) {
    return <span className="text-white/40 italic">{line}</span>;
  }

  // Preprocessor directives
  if (line.trim().startsWith('#include') || line.trim().startsWith('#define')) {
    const parts = line.split(' ');
    return (
      <>
        <span className="text-[#ff9500] font-medium">{parts[0]} </span>
        <span className="text-[#34c759]">{parts.slice(1).join(' ')}</span>
      </>
    );
  }

  // String literals
  const stringRegex = /(["'])(?:(?=(\\?))\2.)*?\1/g;
  const parts = line.split(stringRegex);

  if (parts.length > 1) {
    return (
      <span>
        {line.split(/(["'].*?["'])/).map((segment, i) => {
          if (segment.startsWith('"') || segment.startsWith("'")) {
            return (
              <span key={i} className="text-[#34c759]">
                {segment}
              </span>
            );
          }
          return <span key={i}>{formatKeywords(segment)}</span>;
        })}
      </span>
    );
  }

  return formatKeywords(line);
}

function formatKeywords(text: string) {
  const keywords = [
    'void', 'int', 'float', 'long', 'char', 'bool', 'true', 'false',
    'if', 'else', 'while', 'for', 'return', 'const', 'unsigned',
    'setup', 'loop', 'Serial', 'WiFi', 'HTTPClient', 'delay', 'digitalWrite',
    'digitalRead', 'pinMode', 'analogRead', 'analogWrite', 'attachInterrupt'
  ];

  const words = text.split(/(\b\w+\b)/);
  return words.map((word, i) => {
    if (keywords.includes(word)) {
      if (['setup', 'loop', 'digitalWrite', 'pinMode', 'analogRead', 'delay'].includes(word)) {
        return <span key={i} className="text-[#5ac8fa] font-medium">{word}</span>;
      }
      if (['void', 'int', 'float', 'long', 'char', 'bool', 'const', 'unsigned'].includes(word)) {
        return <span key={i} className="text-[#af52de] font-medium">{word}</span>;
      }
      if (['if', 'else', 'while', 'for', 'return'].includes(word)) {
        return <span key={i} className="text-[#ff2d55]">{word}</span>;
      }
      if (['Serial', 'WiFi'].includes(word)) {
        return <span key={i} className="text-[#ff9500] font-medium">{word}</span>;
      }
      return <span key={i} className="text-[#007aff]">{word}</span>;
    }
    return word;
  });
}
