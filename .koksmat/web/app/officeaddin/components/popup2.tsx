import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect, useState } from "react"

export interface PopUpProps {
  
  show:boolean,
  title: string
  description: string
  children: React.ReactNode
  onClose: () => void
}


export function PopUp(props: PopUpProps) {
  if (!props.show) {
    return null
  }
  return (
    <Dialog defaultOpen={props.show} onOpenChange={props.onClose}  >

      <DialogContent className="h-5/6 w-10/12 bg-white">
        <DialogHeader>
          <DialogTitle>{props.title}</DialogTitle>
          <DialogDescription>
          {props.description}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 overflow-auto py-4">
   
       {props.children}
     
        </div>
        <DialogFooter>
          <Button type="button" onClick={()=>props.onClose()}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
