'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Code, ExternalLink } from 'lucide-react'
import { checkFileExists, createFile, openFile } from './app-actions-file-actions'
import { set } from 'date-fns'

export function CreateFileDialogComponent(props: { path: string, content: string }) {
  const { path, content } = props
  const [filePath, setFilePath] = useState(path)
  const [isOpen, setIsOpen] = useState(false)
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [fileExists, setfileExists] = useState(false)
  useEffect(() => {
    setFilePath(path)
    const check = async () => {
      const exists = await checkFileExists(filePath)
      setfileExists(exists)
    }
    check()
  }, [path])
  const handleCreate = async () => {
    const fileExists = await checkFileExists(filePath)
    if (fileExists) {
      setIsAlertOpen(true)
    } else {
      await createNewFile()
    }
  }

  const createNewFile = async () => {

    const createResult = await createFile(filePath, content)
    if (createResult.success) {
      const openResult = await openFile(filePath)
      setMessage(openResult.message)
    } else {
      setMessage(createResult.message)
    }
    setIsOpen(false)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Code className="mr-2 h-4 w-4" />
            Create Test File
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Test File</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="filePath" className="text-right">
                File Path
              </Label>
              <Input
                id="filePath"
                value={filePath}
                onChange={(e) => setFilePath(e.target.value)}
                className="col-span-3"
                placeholder="e.g., test/example"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {fileExists && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="ml-2">
              <ExternalLink className="h-4 w-4" />
              <span className="sr-only">Open preview</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[80vw] sm:max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>File Preview</DialogTitle>
            </DialogHeader>
            <div className="w-full h-[60vh]">

              <iframe src={"/" + path} className="w-full h-full border-0" title="File Preview" />
              <a href={"/" + path} target="_blank">{"/" + path}</a>
            </div>
          </DialogContent>
        </Dialog>
      )}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>File already exists</AlertDialogTitle>
            <AlertDialogDescription>
              A file already exists at this location. Do you want to overwrite it?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={createNewFile}>Overwrite</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {message && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          {message}
        </div>
      )}
    </>
  )
}