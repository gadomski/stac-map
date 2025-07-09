import {
  createTreeCollection,
  DataList,
  FormatNumber,
  Stack,
  Text,
  TreeView,
} from "@chakra-ui/react";
import type { ReactNode } from "react";
import { LuCircle, LuCircleDot, LuFiles } from "react-icons/lu";
import useStacMap from "../hooks/stac-map";
import type { StacGeoparquetMetadata, StacItemCollection } from "../types/stac";
import { ValueInfo } from "./value";

export default function ItemCollection({
  itemCollection,
}: {
  itemCollection: StacItemCollection;
}) {
  const { stacGeoparquetMetadata } = useStacMap();

  return (
    <ValueInfo value={itemCollection} type="Item collection" icon={<LuFiles />}>
      {stacGeoparquetMetadata && (
        <StacGeoparquetInfo
          metadata={stacGeoparquetMetadata}
        ></StacGeoparquetInfo>
      )}
    </ValueInfo>
  );
}

interface Node {
  id: string;
  value: ReactNode;
  children?: Node[];
}

function StacGeoparquetInfo({
  metadata,
}: {
  metadata: StacGeoparquetMetadata;
}) {
  const collection = createTreeCollection<Node>({
    rootNode: {
      id: "root",
      value: "Metadata",
      children: metadata.keyValue.map((kv) => intoNode(kv.key, kv.value)),
    },
  });

  return (
    <Stack gap={4}>
      <DataList.Root orientation={"horizontal"}>
        <DataList.Item>
          <DataList.ItemLabel>Count</DataList.ItemLabel>
          <DataList.ItemValue>
            <FormatNumber value={metadata.count}></FormatNumber>
          </DataList.ItemValue>
        </DataList.Item>
      </DataList.Root>
      <TreeView.Root collection={collection} variant={"subtle"}>
        <TreeView.Label fontWeight={"light"}>Key-value metadata</TreeView.Label>
        <TreeView.Tree>
          <TreeView.Node
            indentGuide={
              <TreeView.BranchIndentGuide></TreeView.BranchIndentGuide>
            }
            render={({ node, nodeState }) =>
              nodeState.isBranch ? (
                <TreeView.BranchControl>
                  <LuCircleDot></LuCircleDot>
                  <TreeView.BranchText>{node.value}</TreeView.BranchText>
                </TreeView.BranchControl>
              ) : (
                <TreeView.Item>
                  <LuCircle></LuCircle>
                  <TreeView.ItemText>{node.value}</TreeView.ItemText>
                </TreeView.Item>
              )
            }
          ></TreeView.Node>
        </TreeView.Tree>
      </TreeView.Root>
    </Stack>
  );
}

// eslint-disable-next-line
function intoNode(key: string, value: any) {
  const children: Node[] = [];

  switch (typeof value) {
    case "string":
    case "number":
    case "bigint":
    case "boolean":
      children.push({
        id: `${key}-value`,
        value: value.toString(),
      });
      break;
    case "symbol":
    case "undefined":
    case "function":
      children.push({
        id: `${key}-value`,
        value: (
          <Text fontWeight="lighter" fontStyle={"italic"}>
            opaque
          </Text>
        ),
      });
      break;
    case "object":
      if (Array.isArray(value)) {
        children.push(
          ...value.map((v, index) => intoNode(index.toString(), v)),
        );
      } else {
        children.push(...Object.entries(value).map(([k, v]) => intoNode(k, v)));
      }
  }

  return {
    id: key,
    value: key,
    children,
  };
}
