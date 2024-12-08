"use client";

import React from "react";

import {
  ComponentDoc,
  ComponentDocumentationHub,
} from "@/components/component-documentation-hub";

import { examplesToolsPage } from "@/components/tools-page";

// Example usage
export default function ExampleUsage() {
  const componentDocs: ComponentDoc[] = [...examplesToolsPage];

  return <ComponentDocumentationHub components={componentDocs} />;
}
