function arrange_tree(){
   const { default: yFiles } = Application.getDependence('yFiles');
   let layout = new yFiles.HierarchicLayout();
   layout.orientationLayoutEnabled = true;
   layout.layoutOrientation = yFiles.LayoutOrientation.LEFT_TO_RIGHT;
   // console.log("applied layout orientation");
   return (layout);

};

let fl = this.run_once;   
if (fl===true){
   let layout = arrange_tree();
   // console.log("yfiles.PortAdjustmentPolicy.NEVER", yfiles.PortAdjustmentPolicy.NEVER);
   // graph.portAdjustmentPolicy = yfiles.PortAdjustmentPolicy.NEVER;
   graph.applyLayout(layout);
   console.log("rearrangeas tree");
}
' '


const { default: yFiles } = Application.getDependence('yFiles');
let layout = new yFiles.HierarchicLayout();
layout.orientationLayoutEnabled = true;
layout.layoutOrientation = yFiles.LayoutOrientation.LEFT_TO_RIGHT;
graph.applyLayout(layout);
console.log("rearrangeas tree");
' '


let fl = this.run_once;   
if (fl===true){
   let layout = arrange_tree();
   // console.log("yfiles.PortAdjustmentPolicy.NEVER", yfiles.PortAdjustmentPolicy.NEVER);
   // graph.portAdjustmentPolicy = yfiles.PortAdjustmentPolicy.NEVER;
   graph.applyLayout(layout);
   console.log("rearrangeas tree");
}
' '
