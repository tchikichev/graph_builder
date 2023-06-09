let liveDash = paramsFillLivedash;
let removeNodes = []
for (let node of liveDash.masterGraph.nodes.filter(
    node => {
        return node.tag.primitiveName === "TargetRichLabelNode1"
    })) {
    removeNodes.push(node)
}

for (let rn of removeNodes) {
    liveDash.masterGraph.remove(rn)
}