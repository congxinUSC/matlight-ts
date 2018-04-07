import {Matrix} from "./matrix";
import {Vector} from "./vector";
import {Utils} from "./utils";

export class LinAlg {

  // if either of the operands is Vector, regard the left operand as a row and the right one as column
  static dot(op1: Matrix | Vector, op2: Matrix | Vector): Matrix {
    if(op1 instanceof Vector) {
      op1 = op1.toMatrix(false);
    }
    if(op2 instanceof Vector) {
      op2 = op2.toMatrix();
    }
    let dim1, dim2, dim2p, dim3;
    dim1 = op1.rows;
    dim2 = op1.cols;
    dim2p = op2.rows;
    dim3 = op2.cols;
    if(dim2 !== dim2p) {
      throw 'size mismatch';
    }
    let ret = new Matrix(dim1, dim3);
    for(let i=0; i<dim1; i++) {
      for(let j=0; j<dim3; j++) {
        for(let k=0; k<dim2; k++) {
          ret.data[i][j] += op1.data[i][k] * op2.data[k][j];
        }
        ret.data[i][j] = ret.data[i][j];
      }
    }
    return ret;
  }
}