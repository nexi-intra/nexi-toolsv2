import yaml from "js-yaml";

interface Mapping {
  [key: string]: string;
}

interface MappingWithComments extends Mapping {
  __comment: string;
}

export function saveMappingsToYaml(mapping: any): string {
  const mappingWithComments: MappingWithComments = {
    __comment: "Mapping from source to target",
    ...mapping,
  };

  return yaml.dump(mappingWithComments, { lineWidth: -1 });
}

export function loadMappingsFromYaml(yamlString: string): Mapping {
  const loadedMapping = yaml.load(yamlString) as MappingWithComments;

  const cleanedMapping: Mapping = {};
  for (const [field, value] of Object.entries(loadedMapping)) {
    if (field !== "__comment") {
      cleanedMapping[field] = value;
    }
  }

  return cleanedMapping;
}
