import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, CheckCircle, Lock, Clock } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useCourse } from '../../contexts/CourseContext';
import type { Module } from '../../lib/types/course';
import { cn } from '../../lib/utils';

interface ModuleCardProps {
  module: Module;
  isCompleted: boolean;
  isLocked: boolean;
  isActive: boolean;
  onSelect: (moduleId: string) => void;
}

function ModuleCard({ module, isCompleted, isLocked, isActive, onSelect }: ModuleCardProps) {
  return (
    <Card
      hover={!isLocked}
      className={cn(
        'group cursor-pointer transition-all duration-200',
        isActive && 'ring-2 ring-accent-purple',
        isLocked && 'opacity-50 cursor-not-allowed'
      )}
      onClick={() => !isLocked && onSelect(module.id)}
    >
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-accent-metallic-light mb-1">
              {module.title}
            </h3>
            <p className="text-sm text-accent-metallic line-clamp-2">{module.description}</p>
          </div>
          <div className="ml-4">
            {isLocked ? (
              <Lock className="w-5 h-5 text-accent-metallic-dark" />
            ) : isCompleted ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <Play className="w-5 h-5 text-accent-purple-light" />
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1 text-accent-metallic">
            <Clock className="w-4 h-4" />
            <span>{module.duration}m</span>
          </div>
          {module.resources.length > 0 && (
            <div className="text-accent-metallic">
              {module.resources.length} resource{module.resources.length !== 1 && 's'}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

interface ModuleListProps {
  modules: Module[];
}

export function ModuleList({ modules }: ModuleListProps) {
  const { progress, selectedModule, selectModule } = useCourse();

  const handleModuleSelect = async (moduleId: string) => {
    await selectModule(moduleId);
  };

  const sortedModules = [...modules].sort((a, b) => a.order - b.order);
  const completedModules = progress?.completedModules || [];
  const lastCompletedIndex = sortedModules.findIndex(
    module => module.id === completedModules[completedModules.length - 1]
  );

  return (
    <div className="space-y-4">
      {sortedModules.map((module, index) => {
        const isCompleted = completedModules.includes(module.id);
        const isLocked = index > lastCompletedIndex + 1;
        const isActive = selectedModule?.id === module.id;

        return (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <ModuleCard
              module={module}
              isCompleted={isCompleted}
              isLocked={isLocked}
              isActive={isActive}
              onSelect={handleModuleSelect}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
