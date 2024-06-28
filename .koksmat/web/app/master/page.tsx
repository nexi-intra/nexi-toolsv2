"use client";

import { SectionFavourites } from "@/components/section-favourites";
import { SectionRegion } from "@/components/section-region";
import { SectionSearch } from "@/components/section-search";
import { ToolMiniature } from "@/components/tool-miniature";

import { ToolMedium } from "@/components/tool-medium";
import { ToolLarge } from "@/components/tool-large";
import { Disclaimer } from "@/components/disclaimer";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Page() {
  const [consented, setconsented] = useState(false);
  return (
    <div>
      
      {!consented && (
           <div className="h-full ">
           What you see is a raw list of components in its v0.1 state. This means that the list includes the initial, basic elements that have been identified and included without any further refinement or organization. It's the earliest version, representing the foundation upon which further development and improvements will be made. At this stage, the components are likely to be in a rough, unpolished form, serving as a preliminary outline rather than a finalized, well-structured product.
           <Button onClick={()=>setconsented(true)}>OK</Button>
           </div>
      )}
      {consented && (
        <div>
       
          <ToolMiniature />
          <SectionFavourites />
          <SectionSearch />
          <SectionRegion />
          <ToolMedium />
          <ToolLarge />
        </div>
      )}
    </div>
  );
}
