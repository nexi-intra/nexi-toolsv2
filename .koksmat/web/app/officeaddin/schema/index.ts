export namespace Metadata {
    export interface KitchenHeader {
  
        name: string
        title: string
        stations: any
        description: string
        path: string
        readme: string
        tag: string
      }
    export interface KitchenHTML {
  
        title: string
        about: string
        description: string

      }
      
export interface Kitchen {
    name: string
    title: string
    stations: Station[]
    description: string
    path: string
    readme: string
  }
  
  export interface Station {
    name: string
    path: string
    title: string
    description: string
    readme: string
    scripts: Script[]
  }
  
  export interface Script {
    name: string
    title: string
    description: string
  }
}
export namespace Cached {
export interface Kitchen {
    scripts: Script[]
    status: Status2
  }
  
  export interface Script {
    status: Status
    route: string
    html: string[]
  }
  
  export interface Status {
    title: string
    description: string
    environment: string[]
    parameters: Parameter[]
    connections?: string[]
  }
  
  export interface Parameter {
    mandatory: boolean
    name: string
    type: string
    help: string
  }
  
  export interface Status2 {
    name: string
    title: string
    stations: Station[]
    description: string
    path: string
    readme: string
    tag: string
  }
  
  export interface Station {
    name: string
    title: string
    path: string
    description: string
    readme: string
    scripts: Script2[]
    tag: string
  }
  
  export interface Script2 {
    name: string
    title: string
    description: string
    environment?: string[]
    connection: string
    input: string
    output: string
    cron: string
    tag: string
    trigger: string
  }
}
  