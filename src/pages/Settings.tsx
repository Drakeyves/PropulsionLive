import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// UI Components
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { cn } from '../lib/utils';

// Icons
import { Bell, Lock, User, Globe, Key, Save, AlertTriangle, Check } from 'lucide-react';

interface BaseField {
  label: string;
  type: string;
}

interface InputField extends BaseField {
  type: 'text' | 'textarea';
  placeholder: string;
}

interface ToggleField extends BaseField {
  type: 'toggle';
}

interface SelectField extends BaseField {
  type: 'select';
  options: string[];
}

interface ButtonField extends BaseField {
  type: 'button';
}

type Field = InputField | ToggleField | SelectField | ButtonField;

interface Section {
  icon: React.ElementType;
  title: string;
  description: string;
  fields: Field[];
}

export function Settings() {
  const [savedStatus, setSavedStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({});

  const sections: Section[] = [
    {
      icon: User,
      title: 'Profile Settings',
      description: 'Manage your personal information and preferences',
      fields: [
        { label: 'Full Name', type: 'text', placeholder: 'Enter your full name' },
        { label: 'Bio', type: 'textarea', placeholder: 'Tell us about yourself' },
        { label: 'Location', type: 'text', placeholder: 'Enter your location' },
        { label: 'Website', type: 'text', placeholder: 'Your personal website' },
      ],
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Configure how you want to receive updates',
      fields: [
        { label: 'Email Notifications', type: 'toggle' },
        { label: 'Push Notifications', type: 'toggle' },
        { label: 'Weekly Digest', type: 'toggle' },
        { label: 'Course Updates', type: 'toggle' },
        { label: 'Community Mentions', type: 'toggle' },
      ],
    },
    {
      icon: Lock,
      title: 'Privacy & Security',
      description: 'Manage your account security and privacy preferences',
      fields: [
        { label: 'Two-Factor Authentication', type: 'toggle' },
        {
          label: 'Profile Visibility',
          type: 'select',
          options: ['Public', 'Private', 'Members Only'],
        },
        { label: 'Activity Status', type: 'toggle' },
        { label: 'Change Password', type: 'button' },
      ],
    },
    {
      icon: Globe,
      title: 'Preferences',
      description: 'Customize your learning experience',
      fields: [
        {
          label: 'Language',
          type: 'select',
          options: ['English', 'Spanish', 'French', 'German', 'Japanese'],
        },
        {
          label: 'Theme',
          type: 'select',
          options: ['System Default', 'Dark Mode', 'Light Mode', 'High Contrast'],
        },
        { label: 'Reduce Animations', type: 'toggle' },
      ],
    },
  ];

  const handleToggle = (label: string) => {
    setToggleStates(prev => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const handleSave = async () => {
    setSavedStatus('saving');
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSavedStatus('saved');
    setTimeout(() => setSavedStatus('idle'), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Settings Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0A0F35] to-[#121212] p-8 border border-accent-purple/10"
      >
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Account Settings</h1>
            <p className="text-accent-metallic mt-2">
              Manage your account preferences and security settings
            </p>
          </div>
          <Button
            size="lg"
            className="group relative overflow-hidden bg-gradient-to-r from-[#8000FF] to-[#FF00FF] hover:from-[#00FFFF] hover:to-[#8000FF]"
            onClick={handleSave}
            disabled={savedStatus === 'saving'}
          >
            {savedStatus === 'idle' && (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save Changes
              </>
            )}
            {savedStatus === 'saving' && (
              <>
                <div className="animate-spin w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full" />
                Saving...
              </>
            )}
            {savedStatus === 'saved' && (
              <>
                <Check className="w-5 h-5 mr-2" />
                Saved!
              </>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 gap-8">
        <AnimatePresence>
          {sections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
            >
              <Card className="overflow-hidden group hover:border-accent-purple/30 transition-all duration-300">
                <div className="p-6 space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-[#8000FF] to-[#FF00FF] bg-opacity-10">
                      <section.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-accent-metallic-light group-hover:text-white transition-colors">
                        {section.title}
                      </h2>
                      <p className="text-accent-metallic mt-1">{section.description}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {section.fields.map(field => (
                      <div
                        key={field.label}
                        className="flex items-center justify-between p-4 rounded-lg bg-background-secondary/30 hover:bg-background-secondary/50 transition-colors"
                      >
                        <label
                          className="flex items-center space-x-3 text-accent-metallic-light"
                          id={`${field.label.toLowerCase().replace(/\s+/g, '-')}-label`}
                        >
                          {field.type === 'toggle' && (
                            <div
                              className={cn(
                                'w-2 h-2 rounded-full',
                                toggleStates[field.label]
                                  ? 'bg-accent-purple-light'
                                  : 'bg-accent-metallic-dark'
                              )}
                            />
                          )}
                          <span>{field.label}</span>
                        </label>
                        {field.type === 'toggle' ? (
                          <button
                            type="button"
                            role="switch"
                            aria-checked={(toggleStates[field.label] || false).toString()}
                            aria-labelledby={`${field.label.toLowerCase().replace(/\s+/g, '-')}-label`}
                            onClick={() => handleToggle(field.label)}
                            className={cn(
                              'relative w-12 h-6 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent-purple/20',
                              toggleStates[field.label]
                                ? 'bg-accent-purple'
                                : 'bg-accent-metallic-dark/20'
                            )}
                          >
                            <span
                              className={cn(
                                'absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out',
                                toggleStates[field.label] && 'translate-x-6'
                              )}
                            />
                          </button>
                        ) : field.type === 'select' ? (
                          <select
                            className="bg-background/50 border border-accent-purple/20 rounded-lg px-4 py-2 text-accent-metallic-light focus:outline-none focus:ring-2 focus:ring-accent-purple/20 hover:border-accent-purple/40 transition-colors"
                            aria-labelledby={`${field.label.toLowerCase().replace(/\s+/g, '-')}-label`}
                          >
                            {(field as SelectField).options.map(option => (
                              <option
                                key={option}
                                value={option.toLowerCase().replace(' ', '_')}
                                className="bg-background text-accent-metallic-light"
                              >
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : field.type === 'button' ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-accent-purple/20 hover:border-accent-purple/40"
                          >
                            <Key className="w-4 h-4 mr-2" />
                            {field.label}
                          </Button>
                        ) : (
                          <input
                            type={field.type}
                            placeholder={(field as InputField).placeholder}
                            aria-labelledby={`${field.label.toLowerCase().replace(/\s+/g, '-')}-label`}
                            className="bg-background/50 border border-accent-purple/20 rounded-lg px-4 py-2 text-accent-metallic-light placeholder-accent-metallic-dark focus:outline-none focus:ring-2 focus:ring-accent-purple/20 hover:border-accent-purple/40 transition-colors w-64"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Security Alert */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-lg bg-red-500/10 border border-red-500/20"
      >
        <div className="flex items-center space-x-3 text-red-400">
          <AlertTriangle className="w-5 h-5" />
          <p>
            Remember to keep your security settings up to date. Enable two-factor authentication for
            enhanced protection.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
