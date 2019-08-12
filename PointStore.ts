import { Point } from "./Point"

class PS {
  points: Point[] = [];
  guidePoints = [];
  selectedPoint: Point;
  notify() { }

  addNewPoint(point: Point) {
    this.points.push(point);
  }

  getPath() {
    let path = this.points.reduce((a, b, index) => {
      return [...a, b.getPath().path];
    }, []);

    let guide = this.points.reduce((a, b, index) => {
      return [...a, b.getPath().guide];
    }, []);
    return { path: path.join(" "), guide: guide.join(" ") };
  }

  removeSelectedNode() {

    let i = this.points.indexOf(this.selectedPoint);
    let removedNodes: SVGCircleElement[] = [];
    if (i > 0) {
      
      for (let sn of this.selectedPoint.metaPoint) {
        removedNodes.push(sn.getNode());
      }
      removedNodes.push(this.selectedPoint.getNode());
      this.selectedPoint.metaPoint.length = 0;

      this.points.splice(i, 1);
    }
    return removedNodes;
  }

  removeAllNodes() {
    let removedNodes: SVGCircleElement[] = [];
    for (let i = this.points.length - 1; i >= 0; i--) {
      let cr = this.points[i];
      removedNodes.push(cr.getNode());
      for (let sn of cr.metaPoint) {
        removedNodes.push(sn.getNode());
      }
      cr.metaPoint.length = 0;
      this.points.splice(i, 1);
    }
    this.points.length = 0;
    return removedNodes;
  }

  getPreciousPoint(point: Point) {
    let index = this.points.indexOf(point);
    return this.points[index - 1];
  }
  
  getLastPoint() {
    let index = this.points.length - 1;
    return this.points[index];
  }
}

let PointStore = new PS();

export { PointStore }