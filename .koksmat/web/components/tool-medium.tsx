/**
* This code was generated by v0 by Vercel.
* @see https://v0.dev/t/ZHkwsEYEuP3
* Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
*/
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function ToolMedium() {
  return (
    <Card className="w-[300px] p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <Badge variant="secondary" className="bg-[#00d8ff] text-white">
          Group
        </Badge>
        <StarIcon className="text-muted-foreground" />
      </div>
      <div className="flex flex-col items-center mb-4">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4">
          <UsersIcon className="text-[#00d8ff] w-10 h-10" />
        </div>
        <h3 className="text-lg font-semibold text-center">Abilitazione utenti interni - esterni</h3>
        <Link href="#" className="text-[#00d8ff] mt-2" prefetch={false}>
          read more +
        </Link>
      </div>
      <Button variant="outline" className="w-full text-[#00d8ff] border-[#00d8ff]">
        OPEN TOOL
      </Button>
    </Card>
  )
}

function StarIcon(props : any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}


function UsersIcon(props : any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}