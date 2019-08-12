import { PointStore } from "./PointStore"

export class Point {
  x = 0;
  y = 0;
  elm: SVGCircleElement;
  metaPoint: Point[] = [];
  type = "M"
  static points = [];
  container: SVGElement;
  guideContainer: SVGGElement;
  
  constructor(container: SVGElement, x, y) {
    this.container = container;
    this.guideContainer = container.querySelector('#guideContainer');

    this.x = x;
    this.y = y;

    this.elm = this.createPoint();

    this.elm.onclick = e => {
      e.stopPropagation();
      PointStore.points.forEach(i => {
        i.getNode().classList.remove("selectedNode");
      });
      PointStore.selectedPoint = this;
      this.elm.classList.add("selectedNode");
    };

    let mmH = e => {
      e.stopPropagation();
      let offset = container.getBoundingClientRect();
      let x = e.x - offset.left;
      let y = e.y - offset.top;
      if (e.which == 1) {
        this.update(x, y);
        PointStore.notify();
      }
    };

    let muH = e => {
      e.stopPropagation();
      container.removeEventListener("mousemove", mmH);
      container.removeEventListener("mouseup", muH);
    };

    this.elm.onmousedown = e => {
      e.stopPropagation();
      container.addEventListener("mousemove", mmH);
      container.addEventListener("mouseup", muH);
    };
  }
  createPoint() {
    let point = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    point.setAttribute("stroke", "darkgray");
    point.setAttribute("class", "point");
    point.setAttribute("stroke-width", "2");
    point.setAttribute("fill", "transparent");
    point.setAttribute("r", "5");
    return point;
  }

  update(x, y) {
    this.x = x || this.x;
    this.y = y || this.y;

    this.elm.setAttribute("cx", this.x.toString());
    this.elm.setAttribute("cy", this.y.toString());
  }

  getNode() {
    this.update(this.x, this.y);
    return this.elm;
  }

  getPath() {
    return { path: `M${this.x},${this.y}`, guide: '' };
  }
}

export class Line extends Point {
  constructor(container, x, y) {
    super(container, x, y);
    this.type = "l"
  }

  getPath() {
    let pp = PointStore.getPreciousPoint(this);
    let path = `l${this.x - pp.x},${this.y - pp.y}`;
    return { path, guide: '' };
  }
}

export class Quad extends Point {
  sx = 0;
  sy = 0;
  constructor(container: SVGElement, x, y) {
    super(container, x, y);
    let lp = PointStore.getLastPoint();
    this.sx = (lp.x + x) / 2;
    this.sy = 25 + (lp.y + y) / 2;
    this.type = "q"
    let meta = new Point(this.container, this.sx, this.sy)
    this.metaPoint.push(meta);
    let meta1Node = meta.getNode();
    meta1Node.classList.add('helperNode');
    this.guideContainer.appendChild(meta1Node);
  }

  update(x, y) {
    super.update(x, y);
    let q = this.metaPoint[0];
    q && q.update(q.x, q.y);
  }

  getPath() {
    let q = this.metaPoint[0];
    let pp = PointStore.getPreciousPoint(this);
    let xOff = pp.x;
    let yOff = pp.y;

    let path = `q${q.x - xOff},${q.y - yOff} ${this.x - xOff},${this.y - yOff}`;
    let guide = `M${pp.x},${pp.y} L${q.x},${q.y} L${this.x},${this.y}`;

    return {
      path,
      guide
    };
  }
}

export class Cube extends Point {
  sxa = 0;
  sya = 0;
  sxb = 0;
  syb = 0;
  constructor(container: SVGElement, x, y) {
    super(container, x, y);
    let lp = PointStore.getLastPoint();
    this.sxa = -5 + (lp.x + x) / 2;
    this.sya = 25 + (lp.y + y) / 2;
    this.sxb = 5 + (lp.x + x) / 2;
    this.syb = -25 + (lp.y + y) / 2;
    this.type = "c"
    let meta1 = new Point(this.container, this.sxa, this.sya);
    let meta2 = new Point(this.container, this.sxb, this.syb);

    this.metaPoint.push(meta1);
    let meta1Node = meta1.getNode();
    this.guideContainer.appendChild(meta1Node);
    meta1Node.classList.add('helperNode');
    let meta2Node = meta2.getNode();
    this.metaPoint.push(meta2);
    this.guideContainer.appendChild(meta2Node);
    meta2Node.classList.add('helperNode');
  }

  update(x, y) {
    super.update(x, y);
    let q1 = this.metaPoint[0];
    let q2 = this.metaPoint[1];
    q1 && q1.update(q1.x, q1.y);
    q2 && q2.update(q2.x, q2.y);
  }

  getPath() {

    let p1 = this.metaPoint[0];
    let p2 = this.metaPoint[1];

    let pp = PointStore.getPreciousPoint(this);
    let xOff = pp.x;
    let yOff = pp.y;


    let path = `c${p1.x - xOff},${p1.y - yOff} ${p2.x - xOff},${p2.y - yOff} ${this.x - xOff},${this.y - yOff}`;
    let guide = `M${p1.x},${p1.y} L${pp.x},${pp.y}` + `M${p2.x},${p2.y} L${this.x},${this.y}`;

    return {
      path,
      guide
    };

  }
}

export class Arc extends Point {
  rx = 0;
  ry = 0;

  constructor(container: SVGElement, x, y) {
    super(container, x, y);
    let lp = PointStore.getLastPoint();
    this.rx = (lp.x + x) / 2;
    this.ry = (lp.y + y) / 2;
    this.type = "a"
    let meta1 = new Point(this.container, this.rx, this.ry);
    this.metaPoint.push(meta1);
    let meta1Node = meta1.getNode();
    this.guideContainer.appendChild(meta1Node);
    meta1Node.classList.add('helperNode');
  }

  update(x, y) {
    super.update(x, y);
    let q1 = this.metaPoint[0];
    q1 && q1.update(q1.x, q1.y);
  }

  getPath() {

    let p1 = this.metaPoint[0];

    let pp = PointStore.getPreciousPoint(this);
    let xOff = pp.x;
    let yOff = pp.y;

    let x = (p1.x) / 2
    let y = (p1.y) / 2

    let path = `A${x},${y} 0 1 1 ${this.x - xOff},${this.y - yOff}`;
    return {
      path,
      guide: ''
    };

  }
}

export class Factory {
  static createPath(pathName, container, x, y) {
    switch (pathName) {
      case "Point":
      case "P":
        return new Point(container, x, y);
      case "Line":
      case "L":
        return new Line(container, x, y);
        break;
      case "Cube":
      case "C":
        return new Cube(container, x, y);
        break;
      case "Quad":
      case "Q":
        return new Quad(container, x, y);
        break;
      case "Arc":
      case "A":
        return new Arc(container, x, y);
        break;
    }
  }
}