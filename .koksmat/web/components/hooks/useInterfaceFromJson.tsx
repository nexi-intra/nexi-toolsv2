import { useEffect, useState } from "react";


import JsonToTS from "json-to-ts";
/**
 * 
 * @param prefix Example: "I" + database + table + "Props"
 * @returns 
 */
export function useInterfaceFromJson(prefix: string) {
  const [interfaceDefintions, setinterfaceDefintions] = useState("");
  const [interfacename, setinterfacename] = useState("");
  const [json, setjson] = useState("");
  useEffect(() => {
    if (!json) return;
    const obj = JSON.parse(json);
    const newName =
      prefix + "Item";
    setinterfacename(newName);




    try {


      const interfaces = JsonToTS(obj).map((typeInterface, index) => {
        if (index === 0) {
          return typeInterface.replace("RootObject", newName);
        } else {
          return typeInterface;
        }
        //console.log(typeInterface);
      });

      const interfaceDefintions = interfaces.join("\n");
      setinterfaceDefintions(interfaceDefintions);
      // const load = async () => {
      //   const name = "I" + database + table + "Props";
      //   setinterfacename(name);
      //   const code = await jsonToInterface(JSON.stringify(json, null, 2));
      //   setcode(code);
      // };
      // load();
    } catch (error) {

    }
  }, [json]);
  return ({ interfaceDefintions, interfacename, setjson });
}