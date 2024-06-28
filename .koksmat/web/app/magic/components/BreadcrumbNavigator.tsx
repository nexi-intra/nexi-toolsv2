import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Fragment } from "react";

export default function BreadcrumbNavigator(props: { filePath: string }) {
  const { filePath } = props;
  const parts = filePath.split("/");
  const leaf = parts[parts.length - 1];
  const parents = parts.slice(0, parts.length - 1);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {parents.map((part, index) => {
          const href = "/" + parents.slice(0, index + 1).join("/");
          return (
            <Fragment key={index}>
              <BreadcrumbItem key={index}>
                <BreadcrumbPage>{part}</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </Fragment>
          );
        })}

        <BreadcrumbItem>
          <BreadcrumbPage>{leaf}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
