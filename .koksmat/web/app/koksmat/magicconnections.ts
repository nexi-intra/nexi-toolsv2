"use client";

import { run } from "./magicservices";

export interface MagicService {
  name: string;
  version: number;
  endpoints: string[];
}

export interface MagicToken {
  token: string;
  expires: Date;
}

// Singleton class called MagicConnections

export class MagicConnections {
  private static instance: MagicConnections;
  private connections: Map<string, MagicToken>;

  private constructor() {
    this.connections = new Map<string, MagicToken>();
  }

  public static getInstance(): MagicConnections {
    if (!MagicConnections.instance) {
      MagicConnections.instance = new MagicConnections();
    }

    return MagicConnections.instance;
  }

  public async connect(serviceName: string, msalToken: string) {
    const result = await run(
      serviceName + ".connect",
      [msalToken],
      "",
      10,
      "connect"
    );
    if (result.hasError) {
      return result;
    } else {
      return result;
    }
  }
}
