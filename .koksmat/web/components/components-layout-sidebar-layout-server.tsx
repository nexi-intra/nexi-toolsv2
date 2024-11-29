
import { promises as fs } from 'fs'
import path from 'path'
import SidebarLayoutClient from './components-layout-sidebar-layout-client'
import ErrorBoundary from './error-boundary'


interface FileStructure {
  [key: string]: {
    type: 'folder' | 'file'
    children?: FileStructure
  }
}

async function getFileStructure(dir: string): Promise<FileStructure> {
  const structure: FileStructure = {}
  const items = await fs.readdir(dir, { withFileTypes: true })

  for (const item of items) {
    if (item.isDirectory()) {
      structure[item.name] = {
        type: 'folder',
        children: await getFileStructure(path.join(dir, item.name))
      }
    } else if (item.isFile() && item.name === 'page.tsx') {
      structure[item.name] = { type: 'file' }
    }
  }

  return structure
}

interface SidebarLayoutProps {
  children: React.ReactNode
  rootFolder: string
}

export async function SidebarLayoutServer({ children, rootFolder }: SidebarLayoutProps) {
  const fileStructure = await getFileStructure(rootFolder)

  return (
    <SidebarLayoutClient rootFolder={rootFolder} fileStructure={fileStructure} rootPath={'/test'}>
      <ErrorBoundary >
        {children}
      </ErrorBoundary>


    </SidebarLayoutClient>
  )
}