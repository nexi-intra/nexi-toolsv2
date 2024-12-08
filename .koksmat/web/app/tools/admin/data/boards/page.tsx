
import { BoardList } from "@/components/board-list";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Boards",

};

export default function Page() {


  return (
    <BoardList />
  )
}

