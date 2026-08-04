import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, GitMerge, Award } from 'lucide-react';

const KnowledgeTree = ({ problems = [], onNodeClick }) => {
  
  const getPatternStatus = (patternName) => {
    const matched = problems.filter(p => 
      p.title.toLowerCase().includes(patternName.toLowerCase()) || 
      p.category.toLowerCase().includes(patternName.toLowerCase()) ||
      (p.conceptTags && p.conceptTags.some(tag => tag.toLowerCase().includes(patternName.toLowerCase())))
    );

    if (matched.length === 0) return 'unsolved';
    const hasPending = matched.some(p => p.status === 'Pending');
    return hasPending ? 'pending' : 'completed';
  };

  const dsaNodes = [
    { name: 'BFS', label: 'Breadth First Search', pattern: 'BFS' },
    { name: 'DFS', label: 'Depth First Search', pattern: 'DFS' },
    { name: 'Dijkstra', label: 'Dijkstra Pathfinding', pattern: 'Dijkstra' },
    { name: 'Bellman Ford', label: 'Bellman Ford Negative Weights', pattern: 'Bellman Ford' },
    { name: 'Kruskal', label: 'Kruskal Spanning Tree', pattern: 'Kruskal' },
    { name: 'Floyd Warshall', label: 'Floyd Warshall AP Path', pattern: 'Floyd Warshall' }
  ].map(node => ({
    ...node,
    status: getPatternStatus(node.pattern)
  }));

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-[var(--green)]" />;
      case 'pending': return <AlertTriangle className="h-4 w-4 text-[var(--amber)] animate-pulse" />;
      default: return <XCircle className="h-4 w-4 text-[var(--red)] opacity-50" />;
    }
  };

  const getStatusBorder = (status) => {
    switch (status) {
      case 'completed': return 'border-emerald-500/20 hover:border-emerald-500/40';
      case 'pending': return 'border-amber-500/20 hover:border-amber-500/40';
      default: return 'border-red-500/10 hover:border-red-500/20';
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-card)', border: '0.5px solid var(--border)' }} className="p-6 rounded-2xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
            <GitMerge className="h-4 w-4 text-[var(--purple)]" />
            DSA Knowledge Graph Tree
          </h3>
          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Click node to filter workspace topic queue</p>
        </div>
        <span style={{ backgroundColor: 'var(--purple-bg)', color: 'var(--purple)' }} className="text-[9px] px-2 py-0.5 rounded-full font-bold">
          {dsaNodes.filter(n => n.status === 'completed').length} / {dsaNodes.length} Patterns Mastered
        </span>
      </div>

      {}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {dsaNodes.map(node => (
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            key={node.name}
            onClick={() => onNodeClick && onNodeClick(node.pattern)}
            className={`p-3 bg-[var(--bg-item)] border rounded-xl flex items-center justify-between cursor-pointer transition-colors ${getStatusBorder(node.status)}`}
          >
            <div>
              <h4 className="text-xs font-bold text-[var(--text-primary)]">{node.name}</h4>
              <span className="text-[9px] text-[var(--text-muted)] block mt-0.5">{node.label}</span>
            </div>
            {getStatusIcon(node.status)}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default KnowledgeTree;
