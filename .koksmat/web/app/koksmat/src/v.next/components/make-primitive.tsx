import React, { useState, Dispatch, SetStateAction } from 'react';

import { z } from "zod";

// Define a Zod schema for the child's props.
// For simplicity, we'll just ensure `setValue` is a function.
// The actual React setter is more complex, but we’ll trust TypeScript for the exact type.
export const ValueChildPropsSchema = z.object({
  value: z.string(),
  setValue: z.custom<Dispatch<SetStateAction<string>>>(),
});

// Derive the TypeScript type from the schema
export type ValueChildProps = z.infer<typeof ValueChildPropsSchema>;



interface ValueHostProps {
  // The children must be a ReactElement that expects ValueChildProps,
  // ensuring at compile-time that they accept `value` and `setValue`.
  children: React.ReactElement<ValueChildProps> | React.ReactElement<ValueChildProps>[];
  initialValue?: string;
}

const ValueHost: React.FC<ValueHostProps> = ({ children, initialValue = '' }) => {
  const [value, setValue] = useState(initialValue);

  const childrenWithProps = React.Children.map(children, (child) => {
    // We can safely assume `child` accepts ValueChildProps because of the prop type,
    // so React.cloneElement is safe here.
    return React.cloneElement(child, { value, setValue });
  });

  return <div>{childrenWithProps}</div>;
};

export default ValueHost;
