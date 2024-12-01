'use client'
import React from 'react'

import { useState, useEffect, Fragment } from 'react'
import { Button } from '@/components/ui/button'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FormModeType, GenericTableEditor } from './form-generic-table'
import { set } from 'date-fns'


export default function DatabaseItemDialog({ id, schema, tableName, databaseName }: { id: number, schema: any, tableName: string, databaseName: string }) {

  const [selectedId, setselectedId] = useState<number | null>(null)
  useEffect(() => {
    setselectedId(id)
  }, [id])


  function ShowItem({ id }: { id: number | null }) {
    const [mode, setmode] = useState<FormModeType>("view")
    const [debug, setdebug] = useState(false)
    const [isOpen, setisOpen] = useState(false)
    return <Dialog onOpenChange={(open) => {
      setisOpen(open)
    }} >
      <DialogTrigger asChild  >
        <Button onClick={() => setisOpen(true)} variant="outline">Details</Button>
      </DialogTrigger>
      <DialogContent >
        <DialogHeader>
          <DialogTitle>Item details</DialogTitle>
        </DialogHeader>
        <DialogDescription>

        </DialogDescription>
        <DialogDescription>


        </DialogDescription>
        <div className='max-h-[80vh] max-w-[80vw] overflow-auto '>
          {id && (
            <GenericTableEditor schema={schema} tableName={tableName} databaseName={databaseName} id={id} defaultMode={mode}
              showJSON={debug}

              onUpdated={() => setmode("view")} />)}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setdebug(!debug)}>Debug</Button>

          <Button variant="outline" onClick={() => setmode("edit")}>Edit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  }
  return <ShowItem id={selectedId} />
}