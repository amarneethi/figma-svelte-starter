figma.showUI(__html__, { width: 400, height: 400 });

figma.ui.onmessage = (msg) => {
  if (msg.type === "alert") {
    figma.notify(msg.message);
  }
};

figma.on("run", () => {
  console.log("run");
});
