"use client";

import { SectionFavourites } from "@/components/section-favourites";
import { SectionRegion } from "@/components/section-region";
import { SectionSearch } from "@/components/section-search";
import { ToolMiniature } from "@/components/tool-miniature";

import { ToolMedium } from "@/components/tool-medium";

import { Disclaimer } from "@/components/disclaimer";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Page() {
  const [consented, setconsented] = useState(false);
  return (
    <div>
      {!consented && (
        <div className="h-full ">
          <p>What you see is in very early stage</p>
          <p>
            This means that the list includes the initial, basic elements that
            have been identified and included without any further refinement or
            organization.
          </p>
          <p>
            It&apos;s the earliest version, representing the foundation upon
            which further development and improvements will be made. At this
            stage, the components are likely to be in a rough, unpolished form,
            serving as a preliminary outline rather than a finalized,
            well-structured product.
          </p>
          <p>
            <Button onClick={() => setconsented(true)}>OK</Button>
          </p>
        </div>
      )}
      {consented && (
        <div>
          <SectionFavourites />
          <div className="min-h-screen"></div>
          <SectionSearch />

          <SectionFavourites />

          <SectionRegion />

          <ToolMedium />
        </div>
      )}
    </div>
  );
}
