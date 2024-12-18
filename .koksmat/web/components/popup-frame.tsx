import React, { useState, useMemo, ReactNode } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { z } from 'zod';
import { ZeroTrust } from '@/components/zero-trust';
import { ComponentDoc } from './component-documentation-hub';

/**
 * PopupFrame Component
 * 
 * This component creates a dialog with a customizable trigger to open an iframe containing a specified URL.
 * It accepts a URL and a token, replacing the "TOKEN" placeholder in the URL with the actual token.
 * 
 * The component always remains in view mode and does not support different modes.
 * 
 * Usage:
 * <PopupFrame 
 *   url="https://example.com/profile/TOKEN" 
 *   token="abc123" 
 *   linkText="View Profile"
 *   className="custom-class"
 * >
 *   <CustomTrigger />
 * </PopupFrame>
 */

// Define the schema for the component props
const PopupFrameSchema = z.object({
  url: z.string().url(),
  token: z.string(),
  linkText: z.string(),
  dialogTitle: z.string(),
  className: z.string().optional(),
  children: z.any().optional(),
});

// Infer the type from the schema
type PopupFrameProps = z.infer<typeof PopupFrameSchema>;

export const PopupFrame: React.FC<PopupFrameProps> = (props) => {
  const { url, token, linkText, className = '', children, dialogTitle } = props;

  const [isOpen, setIsOpen] = useState(false);

  // Memoize the modified URL to avoid unnecessary re-computations
  const modifiedUrl = useMemo(() => {
    return url.replace('TOKEN', token);
  }, [url, token]);

  return (
    <div className={`popup-frame ${className}`}>
      <ZeroTrust
        schema={PopupFrameSchema}
        props={{ ...props }}
        actionLevel="error"
        componentName="PopupFrame"
      />
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {children ? (
            children
          ) : (
            <Button variant="link">{linkText}</Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
          </DialogHeader>
          <div className="w-full h-[80vh] bg-cyan-300">

            <iframe

              height="800px"
              width={'100%'}
              src={modifiedUrl}
              className="w-full h-full"
              title="Content Viewer"


            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Example usage documentation
export const examplesPopupFrame: ComponentDoc[] = [
  {
    id: 'PopupFrame',
    name: 'PopupFrame',
    description: 'A component for displaying content in a dialog with an iframe.',
    usage: `
import { PopupFrame } from './components/PopupFrame';

// Example usage with default trigger
<PopupFrame 
  url="https://example.com/profile/TOKEN" 
  token="abc123" 
  linkText="View Profile" 
  className="custom-class"
/>

// Example usage with custom trigger
<PopupFrame 
  url="https://example.com/profile/TOKEN" 
  token="abc123" 
  className="custom-class"
>
  <button className="custom-button">Open Profile</button>
</PopupFrame>
    `,
    example: (
      <PopupFrame
        url="https://example.com/profile/TOKEN"
        token="abc123"
        dialogTitle='Profile'
        linkText="View Profile"
        className="custom-class"
      />
    ),
  }
];

