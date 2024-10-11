'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ComponentProp {
  name: string;
  description: string;
}

export interface ComponentDoc {
  id: string;
  name: string;
  description: string;
  usage: string;
  //props: ComponentProp[];
  example: JSX.Element;
}

export interface ComponentDocumentationProps {
  component: ComponentDoc;
}

/**
 * ComponentDocumentation
 * 
 * A component for documenting and showcasing a single component with an interactive
 * table of contents and live component preview.
 */
export const ComponentDocumentation: React.FC<ComponentDocumentationProps> = ({ component }) => {
  const componentsRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">{component.name} Component</h1>
      <section id={`${component.id}-examples`} className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Examples</h2>
        <Card>
          <CardHeader>
            <CardTitle>Live Example</CardTitle>
          </CardHeader>
          <CardContent>
            <div ref={componentsRef}>
              {component.example}
            </div>
          </CardContent>
        </Card>
      </section>
      <section id={`${component.id}-overview`} className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p>{component.description}</p>
      </section>

      <section id={`${component.id}-usage`} className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Usage</h2>
        <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
          <code>{component.usage}</code>
        </pre>
      </section>

      {/* <section id={`${component.id}-props`} className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Props</h2>
        <ul className="list-disc pl-6">
          {component.props.map((prop, index) => (
            <li key={index}><strong>{prop.name}:</strong> {prop.description}</li>
          ))}
        </ul>
      </section> */}
    </div>
  );
};

interface ComponentDocumentationHubProps {
  components: ComponentDoc[];
}

/**
 * ComponentDocumentationHub
 * 
 * A high-level component that accepts one or more sets of component documentations
 * and displays them with a shared table of contents.
 */
export const ComponentDocumentationHub: React.FC<ComponentDocumentationHubProps> = ({ components }) => {
  const [activeSection, setActiveSection] = useState<string>('');

  const allSections = components.flatMap(component => [
    { id: `${component.id}-overview`, title: `${component.name} Overview` },
    { id: `${component.id}-usage`, title: `${component.name} Usage` },
    { id: `${component.id}-props`, title: `${component.name} Props` },
    { id: `${component.id}-examples`, title: `${component.name} Examples` },
  ]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    allSections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [allSections]);

  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-3/4 pr-0 md:pr-8 mb-8 md:mb-0">
        {components.map((component, index) => (
          <ComponentDocumentation key={index} component={component} />
        ))}
      </div>

      <div className="w-full md:w-1/4">
        <div className="md:sticky md:top-4 overflow-auto max-h-screen">
          <Card>
            <CardHeader>
              <CardTitle>Table of Contents</CardTitle>
            </CardHeader>
            <CardContent>
              <nav>
                <ul className="space-y-2">
                  {allSections.map((section) => (
                    <li key={section.id}>
                      <Button
                        variant={activeSection === section.id ? "default" : "ghost"}
                        className="w-full justify-start text-left"
                        onClick={() => {
                          document.getElementById(section.id)?.scrollIntoView({
                            behavior: 'smooth'
                          });
                        }}
                      >
                        {section.title}
                      </Button>
                    </li>
                  ))}
                </ul>
              </nav>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
