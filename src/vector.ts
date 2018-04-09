import {Utils} from './utils';
import {Matrix} from "./matrix";
import {LinAlg} from "./linalg";

export class Vector {
  length: number;
  data: number[];

  constructor(len: number);
  constructor(arr: number[]);
  constructor(arg: number | number[]) {
    if (arg instanceof Array) {
      this.data = arg.slice();
      this.length = arg.length;
    } else {
      this.data = new Array(arg);
      this.length = arg;
      for(let i=0; i<arg; i++) {
        this.data[i] = 0;
      }
    }
  }

  static elementWiseOP(vec: Vector, callback: (op: number) => number): Vector;
  static elementWiseOP(vec: Vector, other: Vector | number, callback: (op1: number, op2: number) => number): Vector;
  static elementWiseOP(arg1: Vector, arg2, arg3?): Vector {
    let vec = new Vector(arg1.data);

    switch (typeof(arg2)) {
      case 'number':
        for (let i = 0; i < vec.length; i++) {
          vec.data[i] = arg3(vec.data[i], arg2);
        }
        break;
      case 'function':
        for (let i = 0; i < vec.length; i++) {
          vec.data[i] = arg2(vec.data[i]);
        }
        break;
      default: // should be Matrix
        if (!(arg2 instanceof Vector) || typeof(arg3) !== 'function') {
          throw 'type error';
        }
        if (vec.length !== arg2.length) {
          throw 'size mismatch';
        }
        for (let i = 0; i < vec.length; i++) {
          vec.data[i] = arg3(vec.data[i], arg2.data[i]);
        }
        break;
    }
    return vec;
  }

  static neg(vec: Vector) {
    return Vector.elementWiseOP(vec, (op) => {
      return -op;
    });
  }

  static add(vec: Vector, other): Vector {
    return Vector.elementWiseOP(vec, other, (op1, op2) => {
      return op1 + op2;
    });
  }

  static sub(vec: Vector, other): Vector {
    return Vector.elementWiseOP(vec, other, (op1, op2) => {
      return op1 - op2;
    });
  }

  static mul(vec: Vector, other): Vector {
    return Vector.elementWiseOP(vec, other, (op1, op2) => {
      return op1 / op2;
    });
  }

  static div(vec: Vector, other): Vector {
    return Vector.elementWiseOP(vec, other, (op1, op2) => {
      return op1 / op2;
    });
  }

  static toMatrix(vecList: Vector[]): Matrix {
    let data = new Array(vecList.length);
    for(let i=0; i<data.length; i++) {
      data[i] = vecList[i].data.slice();
    }
    return new Matrix(data);
  }

  static dot(op1: Vector | Matrix, op2: Vector | Matrix): Matrix {
    return LinAlg.dot(op1, op2);
  }

  static cross(op1: Vector, op2: Vector): Vector {
    let vec = new Vector(3);
    if(op1.length !== 3 || op2.length !== 3) {
      throw 'both operands must be 3 element vector.'
    } else {
      vec.data[0] = op1.data[1]*op2.data[2] - op1.data[2]*op2.data[1];
      vec.data[1] = op1.data[2]*op2.data[0] - op1.data[0]*op2.data[2];
      vec.data[2] = op1.data[0]*op2.data[1] - op1.data[1]*op2.data[0];
    }
    return vec;
  }

  static outer(op1: Vector, op2: Vector): Matrix {
    let m = op1.length;
    let n = op2.length;
    let mat = new Matrix(m, n);
    for(let i=0; i<m; i++) {
      for(let j=0; j<n; j++) {
        mat.data[i][j] = op1.data[i] * op2.data[j];
      }
    }
    return mat;
  }

  static concat(op1: Vector, op2: Vector): Vector {
    let vec = new Vector(op1.data);
    vec.data.concat(op2.data);
    vec.length += op2.length;
    return vec;
  }

  static subVector(vec: Vector, start=0, len=vec.length): Vector {
    return new Vector(vec.data.slice(start, start + len));
  }

  static norm(vec: Vector, n=2): number {
    if(n === Infinity) {
      return Math.max(...vec.data.map(x => Math.abs(x)));
    }
    if(n === -Infinity) {
      return Math.min(...vec.data.map(x => Math.abs(x)));
    }
    let sum = 0;
    for(let i=0; i<vec.length; i++) {
      sum += Math.pow(Math.abs(vec.data[i]), n);
    }
    return Math.pow(sum, 1/n);
  }

  static randomUnitVector(len: number): Vector {
    let arr = new Array(len);
    let sqSum = 0;
    for(let i=0; i<len; i++) {
      arr[i] = Math.random() - 0.5;
      sqSum += arr[i] * arr[i];
    }
    sqSum = Math.sqrt(sqSum);
    for(let i=0; i<len; i++) {
      arr[i] /= sqSum;
    }
    return new Vector(arr);
  }

  elementWiseOP(arg1, arg2?): Vector {
    return Vector.elementWiseOP(this, arg1, arg2);
  }

  neg(): Vector {
    return Vector.neg(this);
  }

  add(other): Vector {
    return Vector.elementWiseOP(this, other, (op1, op2) => {
      return op1 + op2;
    });
  }

  sub(other): Vector {
    return Vector.elementWiseOP(this, other, (op1, op2) => {
      return op1 - op2;
    });
  }

  mul(other): Vector {
    return Vector.elementWiseOP(this, other, (op1, op2) => {
      return op1 * op2;
    });
  }

  div(other): Vector {
    return Vector.elementWiseOP(this, other, (op1, op2) => {
      return op1 / op2;
    });
  }

  norm(n = 2): number {
    return Vector.norm(this, n);
  }

  toMatrix(col=true): Matrix {
    let mat = Vector.toMatrix([this]);
    if(col) {
      mat = mat.transpose();
    }
    return mat;
  }

  transpose(): Matrix {
    return this.toMatrix(false);
  }

  dot(other: Vector | Matrix): Matrix {
    return LinAlg.dot(this, other);
  }

  outer(other: Vector): Matrix {
    return Vector.outer(this, other);
  }

  cross(other: Vector): Vector {
    return Vector.cross(this, other);
  }

  copy(): Vector {
    return new Vector(this.data);
  }

  concat(other: Vector): Vector {
    return Vector.concat(this, other);
  }

  subVector(start=0, len = this.length): Vector {
    return Vector.subVector(this, start, len);
  }
}