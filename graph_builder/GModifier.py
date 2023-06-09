from pickle import TRUE
from .Gbuilder import Gbuilder
import os
import json
import pandas as pd
import numpy as np
import pdb
import sys
import copy

class GModifier(Gbuilder):
    empty_graph_obj = {
        "graph": {
            "nodes": [],
            "edges": [],
            "groups": []
        }
    }

    def __init__(self,
                 node_templates, initPortsTemplate,
                 init_graph = empty_graph_obj) -> None:
        super().__init__(node_templates, initPortsTemplate)
        self.node_ids_by_name = {}
        self.counter_by_type = {}

        self.read_graph(init_graph)

    def register_max_primitive_id(self, primitive_name, primitive_id) -> None:
        if primitive_name not in self.counter_by_type:
            self.counter_by_type[primitive_name] = 0
        id = int(primitive_id.split('_')[-1])
        if id > self.counter_by_type[primitive_name]:
            self.counter_by_type[primitive_name] = id

    def read_graph(self, graph) -> None:
        self.graph_obj = copy.deepcopy(graph)

        # node_ids_by_name = {name: primitiveID}
        for node in graph['graph']['nodes']:
            primitive_name = node['primitiveName']
            primitive_id = node['primitiveID']

            if primitive_id in self.nodes_by_id.keys():
                raise BaseException
            self.nodes_by_id[primitive_id] = node
            self.node_ids_by_name[primitive_id] = primitive_id

            self.register_max_primitive_id(primitive_name, primitive_id)

        self.edges = graph['graph']['edges']
        self.groups = graph['graph']['groups']

    def add_node(self,
                 node_obj,
                 index_name=None,
                 object_type="emptyNode",
                 w=0, h=0) -> str:
        primitive_id = super().add_node(node_obj, object_type, w, h)

        # node = self.get_node(primitive_id)
        # name = node['properties']['Name']['expression']
        if index_name is None:
            index_name = primitive_id
        self.node_ids_by_name[index_name] = primitive_id
        return primitive_id

    def get_node_by_name(self, name)->str:
        return self.node_ids_by_name[name]
    
    # def build_mod(self)->dict:
    #     graph_obj = self.graph_obj['graph']

    #     nodes = graph_obj['nodes']
    #     edges = graph_obj['edges']

    #     nodes.extend(list(self.nodes_by_id.values()))
    #     edges.extend(self.edges)

    #     return {"graph": {
    #         "nodes": nodes,
    #         "edges": edges,
    #         "groups":[]
    #     }}


class GbuilderMultiple(GModifier):
    def __init__(self, node_templates, initPortsTemplate,
                 init_graph=GModifier.empty_graph_obj) -> None:
        super().__init__(node_templates, initPortsTemplate,
                 init_graph)

    def add_edge_node(self, node_obj, 
                 sourceNode, targetNode,
                 index_name=None,
                 object_type = "EmptyNode",
                 edge_object_type = "SimpleEdge",
                 source_port_id=1, target_port_id=0) -> str:
        # start -> + edge -> + inter_edge{node_obj} -> + edge -> end
        inter_node_id = self.add_node(node_obj, index_name,object_type)
        inter_node = self.get_node(inter_node_id)

        inter_target_port_id = 0 # "inPort1"
        inter_source_port_id = 1 # "outPort1"

        self.add_edge(
                 sourceNode, inter_node,
                 object_type = edge_object_type,
                 sourcePortId=source_port_id,
                 targetPortId=inter_target_port_id)
        self.add_edge(
                 inter_node, targetNode,
                 object_type = edge_object_type,
                 sourcePortId=inter_source_port_id,
                 targetPortId=target_port_id)
        return inter_node_id
    
    def add_nodes_from_df(self, df,
                primitive_name_col,
                index_col="",
                props_mapping={
                    'name': "node_name",
                    'object_type': "object_type",
                },
                extensionName="rawPrimitives",
                fix_ports=True,
                label = "name") -> None:
        for _, line in df.iterrows():
            primitiveName = line[primitive_name_col]

            node_obj = self.node_builder.from_df_line(
                primitiveName,
                line, props_mapping)
            node_obj['nodeTitle'] = "$this.props.Name$"

            if fix_ports:
                node_obj['initPorts'] = self.node_builder.get_default_ports()

            if extensionName == "rawPrimitives":
                node_obj["image"] = "/rawPrimitives/" + primitiveName + "/icon.svg"
            else:
                node_obj['extensionName'] = extensionName
            
            index_name = line[index_col]
            self.add_node(
                node_obj, index_name,
                object_type='completeNode')

    def link_nodes_df(self, df,
                      index_col='this_id',
                      parent_col='parent_id',
                      edge_node=None,
                      sourcePortId=1, targetPortId=0) -> None:
        for _, item in df.iterrows():
            # add edges from parent node
            sourceNode = self.get_node(item[parent_col])
            targetNode = self.get_node(item[index_col])

            if edge_node is not None:
                self.add_edge_node(edge_node, sourceNode, targetNode,
                       object_type='completeNode')
                # primitive_name = edge_node['primitiveName']
                # self.add_edge_node(edge_node, sourceNode, targetNode,
                #                    object_type=primitive_name)
            else:
                self.add_edge(
                    sourceNode, targetNode,
                    sourcePortId=sourcePortId, targetPortId=targetPortId)

    def link_nodes(self, df,
            index_col, parent_index_col,
            edge_node=None) -> None:
        
        upd = copy.deepcopy(df)
        upd['this_id'] = upd[index_col].apply(
            lambda name: self.get_node_by_name(name)
        )
        upd['parent'] = upd[parent_index_col].apply(
            lambda name: self.get_node_by_name(name)
        )
        self.link_nodes_df(upd, 'this_id', 'parent', edge_node)
                
            
    def add_residuals(
            self, df,
            parent_name_col,
            parent_index_col= 'index_name',
            primitiveName = 'esOut',
            object_type = 'unknown_cons',
            props_mapping = {'name': 'out_name', 'object_type': 'out_type'}
                    ) -> None:
        
        df_mod = copy.deepcopy(df)
        df_mod = df_mod.groupby(parent_index_col).first().reset_index()

        df_mod['out_primitiveName'] = primitiveName
        index_col = 'out_index_col'
        df_mod[index_col] = df_mod[parent_index_col].apply(lambda x: ' '.join([object_type,x])) 
        df_mod['out_name'] = df_mod[parent_name_col].apply(lambda x: ' '.join([object_type,x])) 
        df_mod['out_type'] = object_type

        self.add_nodes_from_df(df_mod,
                            primitive_name_col="out_primitiveName",
                            index_col=index_col,
                            props_mapping = props_mapping
                            )

        self.link_nodes(df_mod,
            index_col,
            parent_index_col)
        
        
    def add_multiple_nodes(
            self, df,
            index_col,
            props_mapping = {}, primitive_name_col="primitiveName",
            parent_index_col=None, edge_node_obj = None, extensionName = "",
            fix_ports=True
            ) -> None:
        dfu = copy.deepcopy(df)
        dfu = dfu.groupby(index_col).first().reset_index()

        self.add_nodes_from_df(dfu,
                            primitive_name_col, index_col,
                            props_mapping, extensionName, fix_ports
                            )
        
        if parent_index_col is not None:        
            self.link_nodes(dfu, 
                index_col,
                parent_index_col,
                edge_node_obj)