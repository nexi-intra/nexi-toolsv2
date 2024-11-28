import React, { useState, useEffect, useCallback, use } from 'react';
import { z } from 'zod';
import { ZeroTrust } from '@/components/zero-trust';
import { ChevronUp, RefreshCw } from 'lucide-react';
import { ComponentDoc } from './component-documentation-hub';


// Define the schema for the props
const TableOfContentsSchema = z.object({
  sections: z.array(z.object({
    title: z.string(),
    prefix: z.string(),
  })),
  className: z.string().optional(),
  version: z.number().optional(),
});

// Infer the type from the schema
type TableOfContentsProps = z.infer<typeof TableOfContentsSchema>;

// Define the structure for a TOC item
interface TOCItem {
  id: string;
  text: string;
  level: number;
}

/**
 * TableOfContents Component
 * 
 * This component creates a responsive table of contents with scroll spy functionality.
 * It acts as a sticky aside on tablet and larger screens, and includes a "move to top" button.
 * 
 * The component scans the page for elements with IDs matching the provided section prefixes,
 * groups them into sections, and provides an interactive navigation menu with scroll spy.
 * 
 * @param {TableOfContentsProps} props - The props for the TableOfContents component
 * @returns {JSX.Element} The rendered TableOfContents component
 */
export const TableOfContents: React.FC<TableOfContentsProps> = (props) => {
  const [tocItems, setTocItems] = useState<{ [key: string]: TOCItem[] }>({});
  const [activeId, setActiveId] = useState<string>('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Function to extract TOC items from the page
  const extractTocItems = useCallback(() => {

    const newTocItems: { [key: string]: TOCItem[] } = {};
    props.sections.forEach(section => {
      newTocItems[section.title] = [];
      const elements = document.querySelectorAll(`[id^="${section.prefix}"]`);
      elements.forEach(element => {
        const id = element.id;
        if (id) {
          newTocItems[section.title].push({
            id,
            text: element.textContent || '',
            level: parseInt(element.tagName.slice(1)) || 1,
          });
        }
      });
    });
    setTocItems(newTocItems);
  }, [props.sections]);

  // Scroll spy function
  const onScroll = useCallback(() => {
    const scrollPosition = window.scrollY;
    const headerHeight = 100; // Adjust this value based on your layout

    let currentActiveId = '';
    for (const section of Object.values(tocItems).flat()) {
      const element = document.getElementById(section.id);
      if (element) {
        const { top } = element.getBoundingClientRect();
        if (top <= (headerHeight - 100)) {
          currentActiveId = section.id;
        } else {
          break;
        }
      }
    }

    setActiveId(currentActiveId);
    setShowScrollTop(scrollPosition > window.innerHeight);
  }, [tocItems]);

  useEffect(() => {
    //extractTocItems();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [onScroll]);

  useEffect(() => {
    console.log('Version changed:', props.version);
    extractTocItems();

    // Refresh the TOC when the version changes
  }, [props.version])


  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  //return null
  return (
    <>
      <ZeroTrust
        schema={TableOfContentsSchema}
        props={{ ...props }}
        actionLevel="error"
        componentName="TableOfContents"
      />
      <nav className={`hidden lg:block sticky top-4 right-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-y-auto max-h-[calc(100vh-2rem)] ${props.className || ''}`}>
        <div className="flex justify-between items-center mb-4">
          {/* <h2 className="text-xl font-bold">Table of Contents</h2> */}
          {/* <button
            onClick={refreshToc}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Refresh table of contents"
          >
            <RefreshCw className="w-4 h-4" />
          </button> */}
        </div>
        {Object.entries(tocItems).map(([sectionTitle, items]) => (
          <div key={sectionTitle} className="mb-4">
            <h3 className="font-semibold mb-2">{sectionTitle}</h3>
            <ul className="space-y-2">
              {items.map((item) => (
                <li key={item.id} style={{ marginLeft: `${(item.level - 1) * 0.5}rem` }}>
                  <a
                    href={`#${item.id}`}
                    className={`block py-1 px-2 rounded transition-colors ${activeId === item.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                      }`}
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-12 right-12 p-2 bg-primary text-primary-foreground rounded-full shadow-lg transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}
    </>
  );
};

// Example usage documentation
export const examplesTableOfContents: ComponentDoc[] = [{
  id: 'TableOfContents',
  name: 'TableOfContents',
  description: 'A responsive table of contents component with scroll spy functionality.',
  usage: `
import { TableOfContents } from '@/components/TableOfContents';

const sections = [
  { title: 'Introduction', prefix: 'intro-' },
  { title: 'Main Content', prefix: 'main-' },
  { title: 'Conclusion', prefix: 'conclusion-' },
];

<TableOfContents sections={sections} className="w-64" />
  `,
  example: (
    <TableOfContents
      sections={[
        { title: 'Introduction', prefix: 'intro-' },
        { title: 'Main Content', prefix: 'main-' },
        { title: 'Conclusion', prefix: 'conclusion-' },
      ]}
      className="w-64"
    />
  ),
}];
