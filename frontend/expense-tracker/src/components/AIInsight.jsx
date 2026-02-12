import React from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  DollarSign, 
  ShoppingBag, 
  PiggyBank,
  Shield,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const AIInsight = ({ insight }) => {
  if (!insight) return null;

  // Parse sections from the insight text
  const parseInsight = (text) => {
    const sections = [];
    const lines = text.split('\n').filter(line => line.trim());
    
    let currentSection = null;
    let currentSubsection = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Main section headers (### Header)
      if (line.startsWith('###')) {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = {
          title: line.replace(/###\s*\d*\.?\s*/, '').trim(),
          content: [],
          type: getSectionType(line)
        };
        currentSubsection = null;
      }
      // Bullet points with bold labels
      else if (line.startsWith('*')) {
        const bulletContent = line.substring(1).trim();
        
        // Check if it's a bold label (e.g., **Savings Rate:**)
        if (bulletContent.match(/^\*\*[^*]+\*\*/)) {
          const parts = bulletContent.split('**');
          const label = parts[1];
          const value = parts.slice(2).join('').trim();
          
          if (currentSection) {
            currentSection.content.push({
              type: 'keyValue',
              label: label.replace(':', ''),
              value: value
            });
          }
        }
        // Subsection with suggestion
        else if (bulletContent.toLowerCase().includes('suggestion:')) {
          if (currentSubsection) {
            currentSection.content.push(currentSubsection);
          }
          currentSubsection = {
            type: 'suggestion',
            category: lines[i - 1]?.trim().replace('*', '').trim() || '',
            suggestion: bulletContent.replace(/\*?Suggestion:\*?/i, '').trim()
          };
        }
        // Regular bullet point
        else {
          if (currentSubsection) {
            currentSection.content.push(currentSubsection);
            currentSubsection = null;
          }
          
          if (currentSection) {
            currentSection.content.push({
              type: 'bullet',
              text: bulletContent
            });
          }
        }
      }
      // Observation or other special notes
      else if (line.includes('**Observation:**') || line.includes('**Note:**')) {
        const parts = line.split('**');
        if (currentSection) {
          currentSection.content.push({
            type: 'note',
            label: parts[1]?.replace(':', '') || 'Note',
            text: parts.slice(2).join('').trim()
          });
        }
      }
    }
    
    if (currentSubsection) {
      currentSection?.content.push(currentSubsection);
    }
    if (currentSection) {
      sections.push(currentSection);
    }
    
    return sections;
  };

  const getSectionType = (header) => {
    const lower = header.toLowerCase();
    if (lower.includes('financial health')) return 'health';
    if (lower.includes('income')) return 'income';
    if (lower.includes('expense')) return 'expense';
    if (lower.includes('risk') || lower.includes('warning')) return 'warning';
    if (lower.includes('tips') || lower.includes('recommendation')) return 'tips';
    return 'general';
  };

  const getSectionIcon = (type) => {
    switch (type) {
      case 'health': return <Shield className="w-5 h-5" />;
      case 'income': return <ArrowUpRight className="w-5 h-5" />;
      case 'expense': return <ArrowDownRight className="w-5 h-5" />;
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      case 'tips': return <Lightbulb className="w-5 h-5" />;
      default: return <TrendingUp className="w-5 h-5" />;
    }
  };

  const getSectionStyles = (type) => {
    switch (type) {
      case 'health':
        return {
          bg: 'bg-gradient-to-br from-emerald-50 to-green-50',
          border: 'border-emerald-200',
          iconBg: 'bg-gradient-to-br from-emerald-500 to-green-600',
          textColor: 'text-emerald-900'
        };
      case 'income':
        return {
          bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
          border: 'border-blue-200',
          iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-600',
          textColor: 'text-blue-900'
        };
      case 'expense':
        return {
          bg: 'bg-gradient-to-br from-orange-50 to-amber-50',
          border: 'border-orange-200',
          iconBg: 'bg-gradient-to-br from-orange-500 to-amber-600',
          textColor: 'text-orange-900'
        };
      case 'warning':
        return {
          bg: 'bg-gradient-to-br from-red-50 to-rose-50',
          border: 'border-red-200',
          iconBg: 'bg-gradient-to-br from-red-500 to-rose-600',
          textColor: 'text-red-900'
        };
      case 'tips':
        return {
          bg: 'bg-gradient-to-br from-purple-50 to-pink-50',
          border: 'border-purple-200',
          iconBg: 'bg-gradient-to-br from-purple-500 to-pink-600',
          textColor: 'text-purple-900'
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-slate-50 to-gray-50',
          border: 'border-slate-200',
          iconBg: 'bg-gradient-to-br from-slate-500 to-gray-600',
          textColor: 'text-slate-900'
        };
    }
  };

  const formatText = (text) => {
    // Handle bold text (**text**)
    let formatted = text.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>');
    // Handle italic text (*text*)
    formatted = formatted.replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>');
    // Handle rupee symbol
    formatted = formatted.replace(/₹/g, '<span class="font-semibold">₹</span>');
    // Handle percentages
    formatted = formatted.replace(/(\d+\.?\d*%)/g, '<span class="font-semibold text-indigo-600">$1</span>');
    
    return formatted;
  };

  const sections = parseInsight(insight);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold">AI Financial Analysis</h2>
        </div>
        <p className="text-indigo-100 text-sm">
          Your personalized insights are ready. Review the analysis below to optimize your financial decisions.
        </p>
      </div>

      {/* Sections */}
      {sections.map((section, idx) => {
        const styles = getSectionStyles(section.type);
        
        return (
          <div 
            key={idx}
            className={`${styles.bg} border ${styles.border} rounded-xl shadow-md p-5 transition-all hover:shadow-lg`}
          >
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`${styles.iconBg} p-2 rounded-lg text-white shadow-md`}>
                {getSectionIcon(section.type)}
              </div>
              <h3 className={`text-lg font-bold ${styles.textColor}`}>
                {section.title}
              </h3>
            </div>

            {/* Section Content */}
            <div className="space-y-3">
              {section.content.map((item, itemIdx) => {
                if (item.type === 'keyValue') {
                  return (
                    <div key={itemIdx} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <span className="font-semibold text-slate-900">{item.label}:</span>
                        <span 
                          className="ml-2 text-slate-700"
                          dangerouslySetInnerHTML={{ __html: formatText(item.value) }}
                        />
                      </div>
                    </div>
                  );
                }
                
                if (item.type === 'bullet') {
                  return (
                    <div key={itemIdx} className="flex items-start gap-2 ml-4">
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full flex-shrink-0 mt-2" />
                      <p 
                        className="text-sm text-slate-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: formatText(item.text) }}
                      />
                    </div>
                  );
                }
                
                if (item.type === 'suggestion') {
                  return (
                    <div key={itemIdx} className="ml-4 mt-2 mb-3">
                      {item.category && (
                        <p 
                          className="text-sm font-medium text-slate-900 mb-1"
                          dangerouslySetInnerHTML={{ __html: formatText(item.category) }}
                        />
                      )}
                      <div className="bg-white/60 rounded-lg p-3 border border-slate-200">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
                              Suggestion
                            </span>
                            <p 
                              className="text-sm text-slate-700 mt-1 leading-relaxed"
                              dangerouslySetInnerHTML={{ __html: formatText(item.suggestion) }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                
                if (item.type === 'note') {
                  return (
                    <div key={itemIdx} className="bg-white/60 rounded-lg p-3 border border-slate-200">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                            {item.label}
                          </span>
                          <p 
                            className="text-sm text-slate-700 mt-1 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: formatText(item.text) }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                }
                
                return null;
              })}
            </div>
          </div>
        );
      })}

      {/* Footer */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg p-4 border border-slate-200">
        <div className="flex items-start gap-3">
          <PiggyBank className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-slate-900 mb-1">
              Next Steps
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Review these insights regularly to track your progress. Implement the suggestions gradually and monitor how they impact your financial health over time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsight;