'use client'
import React, { use } from 'react'

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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { useKoksmatDatabase } from './database-context-provider'


export default function DatabaseItemDialog({ id, schema, tableName, databaseName }: { id: number, schema: any, tableName: string, databaseName: string }) {
  const table = useKoksmatDatabase().table(tableName, databaseName, schema)
  const [selectedId, setselectedId] = useState<number | null>(null)
  useEffect(() => {
    setselectedId(id)
  }, [id])

  function DeleteItem() {
    return <AlertDialog>
      <AlertDialogTrigger>Delete</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will mark  delete the record as soft deleted. You can always ask your administrator to restore it later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={async () => {

            await table.delete(id, true)
            //setselectedId(null)
          }}>Soft Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

  }

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
          <DeleteItem />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  }
  return <ShowItem id={selectedId} />
}