import copy
import pandas as pd
import json
import os

from traitlets import Any

layoutTemplate = {
        "x": 0.0,
        "y": 0.0,
        "height": 90,
        "width": 90
    }



class NodeBuilder():
    property_value_obj = {
        "type": "expression",
        "expression": "",
        "status": "completed",
        "value": ""
    }

    def __init__(self, 
                 node_templates,
                 port_templates
                 ) -> None:        
        self.node_templates = node_templates
        self.initPortsTemplate = port_templates 
        
    def get_default_ports(self):
        return copy.deepcopy(self.initPortsTemplate)

    @staticmethod
    def fill_property(prop, value) -> None:
        if pd.isna(value):
            prop["value"] = ""
            prop["expression"] = ""
        else:
            prop["value"] = value
            prop["expression"] = '\"{}\"'.format(str(value).replace('"',''))
            # prop["expression"] = '"'+str(value)+'"'

    @staticmethod
    def create_property(property_name, property_value, obj_add_to) -> None:
        obj_add_to["properties"][property_name] = copy.deepcopy(NodeBuilder.property_value_obj)
        NodeBuilder.fill_property(
            obj_add_to["properties"][property_name], 
            property_value)
    
    def get_template(self, template_name)->dict:
        if template_name in self.node_templates:
            template = self.node_templates[template_name]
            node_obj = copy.deepcopy(template)
            return node_obj
        raise BaseException
    
    def from_template(self, primitive_name, template_name=None)->dict:
        if template_name is None:
            template_name = primitive_name
        node_obj = self.get_template(template_name)
        node_obj['primitiveName'] = primitive_name
        return node_obj

    def from_props_map(self, primitiveName, 
                       props_mapping,
                      fix_ports=False,
                      fix_image=False)->dict:
        node_obj = self.from_template(primitiveName)
        node_obj['primitiveName'] = primitiveName

        if fix_ports:
            ports = copy.deepcopy(self.initPortsTemplate)
            node_obj['initPorts'] = ports
        if fix_image:
            node_obj["image"] = "/rawPrimitives/" + primitiveName + "/icon.svg"

        props = node_obj['properties']
        for p, value in props_mapping.items():
            NodeBuilder.create_property(p, value, node_obj)
        return node_obj

    def from_df_line(self, primitiveName, 
                      line, props_mapping={})->dict:
            
        node_obj = self.from_template(primitiveName)
        for p, col_name in props_mapping.items():
            value = ""
            if col_name is not None:
                value = line[col_name]
            NodeBuilder.create_property(p, value, node_obj)
        return node_obj
    

class Gbuilder:
    def __init__(self, 
                 node_templates, initPortsTemplate) -> None:
        self.edges = []
        self.groups = []
        self.nodes_by_id = {}
        self.counter_by_type = {}

        self.node_builder = NodeBuilder(
            node_templates, initPortsTemplate)

    def get_node(self, node_id)-> dict:
        # find node by id
        return self.nodes_by_id[node_id]

    # def get_edge(self, edge_id):
    #     # find node by id
    #     return self.edges_by_id[edge_id]

        # return self.node_templates[default_obj]

    def create_primitive_id(self, primitiveName)->str:
        # register node & get new id
        if primitiveName not in self.counter_by_type:
            self.counter_by_type[primitiveName] = 0

        self.counter_by_type[primitiveName]+=1
        id = self.counter_by_type[primitiveName]
        return primitiveName + '_' + str(id)

    def add_node(self, 
                 node_obj:dict,
                object_type = "emptyNode",
                w=0, h=0
                ) -> str:
        def register_port_ids(primitiveId, ports) -> None:
            for port in ports:
                port_id = '_'.join([primitiveId, port['primitiveName']])
                # node_id = self.create_primitive_id('port')
                port['primitiveID'] = port_id

        primitiveName = node_obj['primitiveName']


        if object_type == "completeNode":
            el = copy.deepcopy(node_obj)
            if 'nodeTitle' not in el.keys():
                el['nodeTitle'] = "$this.primitiveID$"
        else:
            if object_type == "emptyNode":
                el = self.node_builder.from_props_map(
                    primitiveName,
                    node_obj['properties'])
            else:
                el = self.node_builder.from_template(object_type)
                el['primitiveName'] = primitiveName
            
            el['nodeTitle'] = "$this.props.Name$"

        primitive_id = self.create_primitive_id(primitiveName)
        el['primitiveID'] = primitive_id

        if h > 0:
            el['layout']['height'] = h
        if w > 0:
            el['layout']['width'] = w

        register_port_ids(primitive_id, el["initPorts"])
        self.nodes_by_id[primitive_id] = el
        # ports = el["initPorts"]
        return primitive_id
    
    def add_edge(self,
                 sourceNode, targetNode,
                 object_type = "SimpleEdge",
                 sourcePortId=1, targetPortId=0) -> None:
        # start -> + edge -> end
        # create edge between well node and pad node
        eo = self.node_builder.get_template(object_type)

        eo['sourceNode'] = sourceNode['primitiveID']
        eo['targetNode'] = targetNode['primitiveID']
        
        eo['sourcePort'] = sourceNode['initPorts'][sourcePortId]['primitiveID']
        eo['targetPort'] = targetNode['initPorts'][targetPortId]['primitiveID']
        # eo['sourcePort'] = sourceNode['ports'][sourcePortId]['primitiveID']
        # eo['targetPort'] = targetNode['ports'][targetPortId]['primitiveID']
        self.edges.append(eo)
        # self.edges_by_id[node_id] = el

    def build(self)->dict:
        graph_obj = {"graph": {
            "nodes": list(self.nodes_by_id.values()),
            "edges": self.edges,
            "groups":self.groups
        }}
        return graph_obj
    
    @staticmethod
    def dump(graph_obj, dest) -> None:
        with open(dest, 'w') as fp:
            json.dump(graph_obj, fp, ensure_ascii=False, indent=4)




        