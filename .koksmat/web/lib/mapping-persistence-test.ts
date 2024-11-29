import {
  saveMappingsToYaml,
  loadMappingsFromYaml,
} from "./mapping-persistence";

describe("Mapping Persistence", () => {
  const testMappings = {
    serverToClient: {
      fullName: "item.first_name + ' ' + item.last_name",
      age: "new Date().getFullYear() - new Date(item.birth_date).getFullYear()",
    },
    clientToServerCreate: {
      first_name: "item.fullName.split(' ')[0]",
      last_name: "item.fullName.split(' ').slice(1).join(' ')",
    },
    clientToServerUpdate: {
      id: "item.id",
      first_name: "item.fullName.split(' ')[0]",
    },
  };

  test("saveMappingsToYaml should generate valid YAML with comments", () => {
    const yamlString = saveMappingsToYaml(testMappings);
    expect(yamlString).toContain("__comment: Mapping from server to client");
    expect(yamlString).toContain(
      "__comment: Mapping from client to server for create operations"
    );
    expect(yamlString).toContain(
      "__comment: Mapping from client to server for update operations"
    );
    expect(yamlString).toContain(
      "fullName: item.first_name + ' ' + item.last_name"
    );
    expect(yamlString).toContain("first_name: item.fullName.split(' ')[0]");
  });

  test("loadMappingsFromYaml should correctly parse YAML and remove comments", () => {
    const yamlString = saveMappingsToYaml(testMappings);
    const loadedMappings = loadMappingsFromYaml(yamlString);
    expect(loadedMappings).toEqual(testMappings);
    expect(loadedMappings.serverToClient).not.toHaveProperty("__comment");
    expect(loadedMappings.clientToServerCreate).not.toHaveProperty("__comment");
    expect(loadedMappings.clientToServerUpdate).not.toHaveProperty("__comment");
  });

  test("Round trip should preserve mappings", () => {
    const yamlString = saveMappingsToYaml(testMappings);
    const loadedMappings = loadMappingsFromYaml(yamlString);
    const newYamlString = saveMappingsToYaml(loadedMappings);
    expect(loadedMappings).toEqual(testMappings);
    expect(newYamlString).toContain("__comment: Mapping from server to client");
    expect(newYamlString).toContain(
      "__comment: Mapping from client to server for create operations"
    );
    expect(newYamlString).toContain(
      "__comment: Mapping from client to server for update operations"
    );
  });
});
