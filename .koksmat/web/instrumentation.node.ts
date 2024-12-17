// instrumentaion.node.ts
import { NodeSDK } from "@opentelemetry/sdk-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";

import { SimpleSpanProcessor } from "@opentelemetry/sdk-trace-node";
import { appName } from "./lib/appName";

const sdk = new NodeSDK({
  serviceName: appName(),

  spanProcessor: new SimpleSpanProcessor(
    new OTLPTraceExporter({
      url: "http://nexi-intra-kubernetes-jaeger-main.jaeger/v1/traces",
    })
  ),
});

process.on("SIGTERM", () =>
  sdk
    .shutdown()
    .then(
      () => console.log("OTEL SDK shut down successfully"),
      (err) => console.log("Error shutting down OTEL SDK", err)
    )
    .finally(() => process.exit(0))
);

sdk.start();
