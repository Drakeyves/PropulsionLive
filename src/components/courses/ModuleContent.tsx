import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Link as LinkIcon, CheckCircle } from 'lucide-react';
import { VideoPlayer } from './VideoPlayer';
import { useCourse } from '../../contexts/CourseContext';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { Resource } from '../../lib/types/course';

interface ModuleContentProps {
  moduleId: string;
  title: string;
  description: string;
  videoUrl: string;
  transcript: string;
  resources: Resource[];
  notes?: string;
}

export function ModuleContent({
  moduleId,
  title,
  description,
  videoUrl,
  transcript,
  resources,
  notes: initialNotes = '',
}: ModuleContentProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [isEditing, setIsEditing] = useState(false);
  const { updateProgress, markModuleComplete } = useCourse();

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };

  const handleNotesSave = () => {
    updateProgress({
      notes: [
        {
          moduleId,
          content: notes,
          timestamp: new Date().toISOString(),
        },
      ],
    });
    setIsEditing(false);
  };

  const handleModuleComplete = () => {
    markModuleComplete(moduleId);
  };

  const getResourceIcon = (type: Resource['type']) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-4 h-4" />;
      case 'link':
        return <LinkIcon className="w-4 h-4" />;
      default:
        return <Download className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleModuleComplete}
          className="flex items-center gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          Mark Complete
        </Button>
      </div>

      <p className="text-muted-foreground">{description}</p>

      <VideoPlayer videoUrl={videoUrl} moduleId={moduleId} onComplete={handleModuleComplete} />

      <Tabs defaultValue="resources" className="w-full">
        <TabsList>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="resources">
          <Card>
            <div className="p-6 space-y-4">
              {resources.map(resource => (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted"
                >
                  <div className="flex items-center gap-3">
                    {getResourceIcon(resource.type)}
                    <span>{resource.title}</span>
                  </div>
                  <Button variant="secondary" size="sm" className="ml-4">
                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                      Download
                    </a>
                  </Button>
                </motion.div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <div className="p-6">
              {isEditing ? (
                <div className="space-y-4">
                  <textarea
                    value={notes}
                    onChange={handleNotesChange}
                    className="w-full h-48 p-4 rounded-lg border bg-muted resize-none focus:outline-none focus:ring-2 focus:ring-accent-purple"
                    placeholder="Write your notes here..."
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleNotesSave}>Save Notes</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="min-h-[12rem] p-4 rounded-lg bg-muted">
                    {notes ? (
                      <p className="whitespace-pre-wrap">{notes}</p>
                    ) : (
                      <p className="text-muted-foreground">No notes yet. Click edit to add some.</p>
                    )}
                  </div>
                  <div className="flex justify-end">
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                      Edit Notes
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
