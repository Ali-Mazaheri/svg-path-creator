// Import stylesheets
import './style.css';

import { div, path, svg, btnClear, btnRemove, helperPath, guideContainer, showGuide, gridContainer, showGrid } from "./UIItems";

import { PointStore } from "./PointStore"
import { Point, Line, Quad, Cube, Factory } from "./Point"

PointStore.notify = () => {
  update();
}

showGuide.onclick = function (e) {
  if (showGuide.checked) {
    guideContainer.classList.remove("hide");
  } else {
    guideContainer.classList.add("hide");
  }
}

showGrid.onclick = function (e) {
  if (showGrid.checked) {
    gridContainer.classList.remove("hide");
  } else {
    gridContainer.classList.add("hide");
  }
}

svg.onclick = function (e: MouseEvent) {
  let offset = svg.getBoundingClientRect();

  let x = e.x - offset.left;
  let y = e.y - offset.top;

  if (!PointStore.getLastPoint()) {
    let p0 = new Point(svg, x, y);
    PointStore.addNewPoint(p0);
    let domNode = p0.getNode();
    domNode.classList.add("baseNode");
    guideContainer.appendChild(domNode);
    return;
  }

  let radios = document.getElementsByName('path');

  let p;
  for (var i = 0; i < radios.length; i++) {
    let rad: HTMLInputElement = radios[i] as HTMLInputElement;
    if (rad.checked) {
      p = Factory.createPath(rad.value, svg, x, y);
      break;
    }
  }

  PointStore.addNewPoint(p);
  guideContainer.appendChild(p.getNode());
  update();
}

btnClear.onclick = function () {
  let nodes = PointStore.removeAllNodes();
  nodes.forEach((x, i, k) => {
    guideContainer.removeChild(x);
  });
  update();
}

btnRemove.onclick = function () {
  let nodes = PointStore.removeSelectedNode();
  nodes.forEach((x, i, k) => {
    guideContainer.removeChild(x);
  });
  update();
}

function update() {
  let p = PointStore.getPath();
  div.innerText = p.path;
  path.setAttribute("d", p.path);
  helperPath.setAttribute("d", p.guide);
}


// Initialie -- Draw a heart
(function drawInitilPath() {
  let p = Factory.createPath("P", svg, 125, 175);
  PointStore.addNewPoint(p);
  let domNode = p.getNode();
  domNode.classList.add("baseNode");
  guideContainer.appendChild(domNode);

  p = Factory.createPath("C", svg, 250, 150);
  p.metaPoint[0].x = 100;
  p.metaPoint[0].y = 50;
  p.metaPoint[1].x = 250;
  p.metaPoint[1].y = 50;
  PointStore.addNewPoint(p);
  guideContainer.appendChild(p.getNode());

  p = Factory.createPath("C", svg, 375, 175);
  p.metaPoint[0].x = 250;
  p.metaPoint[0].y = 50;
  p.metaPoint[1].x = 400;
  p.metaPoint[1].y = 50;
  PointStore.addNewPoint(p);
  guideContainer.appendChild(p.getNode());

  p = Factory.createPath("C", svg, 250, 350);
  p.metaPoint[0].x = 350;
  p.metaPoint[0].y = 250;
  p.metaPoint[1].x = 275;
  p.metaPoint[1].y = 275;
  PointStore.addNewPoint(p);
  guideContainer.appendChild(p.getNode());

  p = Factory.createPath("C", svg, 125, 175);
  p.metaPoint[0].x = 225;
  p.metaPoint[0].y = 275;
  p.metaPoint[1].x = 150;
  p.metaPoint[1].y = 250;
  PointStore.addNewPoint(p);
  guideContainer.appendChild(p.getNode());

  update();
})()
