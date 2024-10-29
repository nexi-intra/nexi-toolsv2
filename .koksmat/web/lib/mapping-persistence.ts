import yaml from "js-yaml";

interface Mapping {
  [key: string]: string;
}

interface MappingWithComments extends Mapping {
  __comment: string;
}

type MappingType =
  | "serverToClient"
  | "clientToServerCreate"
  | "clientToServerUpdate";

export function saveMappingsToYaml(
  mappings: Record<MappingType, Mapping>
): string {
  const mappingsWithComments: Record<MappingType, MappingWithComments> = {
    serverToClient: {
      __comment: "Mapping from server to client",
      ...mappings.serverToClient,
    },
    clientToServerCreate: {
      __comment: "Mapping from client to server for create operations",
      ...mappings.clientToServerCreate,
    },
    clientToServerUpdate: {
      __comment: "Mapping from client to server for update operations",
      ...mappings.clientToServerUpdate,
    },
  };

  return yaml.dump(mappingsWithComments, { lineWidth: -1 });
}

export function loadMappingsFromYaml(
  yamlString: string
): Record<MappingType, Mapping> {
  const loadedMappings = yaml.load(yamlString) as Record<
    MappingType,
    MappingWithComments
  >;

  const cleanedMappings: Record<MappingType, Mapping> = {
    serverToClient: {},
    clientToServerCreate: {},
    clientToServerUpdate: {},
  };

  for (const [key, value] of Object.entries(loadedMappings)) {
    const cleanedMapping: Mapping = {};
    for (const [field, mapping] of Object.entries(value)) {
      if (field !== "__comment") {
        cleanedMapping[field] = mapping;
      }
    }
    cleanedMappings[key as MappingType] = cleanedMapping;
  }

  return cleanedMappings;
}
