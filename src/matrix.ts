import {Utils} from './utils';
import {LinAlg} from './linalg';
import {Vector} from "./vector";
export class Matrix {
  // properties
  rows: number;
  cols: number;
  data: number[][];

  // constructors
  constructor(rows: number);
  constructor(rows: number, cols: number);
  constructor(data: number[][]);
  constructor(arg1, arg2?: number) {
    if (typeof(arg1) === 'number') {
      if (arg1 <= 0) {
        throw 'invalid parameter';
      }
      this.rows = arg1;
      if (arg2) {
        if (arg2 <= 0) {
          throw 'invalid parameter';
        }
        this.cols = arg2;
      } else {
        this.cols = this.rows;
      }
      this.data = new Array(this.rows);
      for (let i = 0; i < this.rows; i++) {
        this.data[i] = new Array(this.cols);
        for (let j = 0; j < this.cols; j++) {
          this.data[i][j] = 0;
        }
      }
    } else {
      if (!(arg1 instanceof Array)) {
        throw 'invalid parameter';
      }
      this.data = arg1.map((row: Array<number>) => {
        if (!(row instanceof Array)) {
          throw 'invalid parameter';
        }
        return row.slice();
      });
      this.rows = arg1.length;
      if (this.rows === 0) {
        throw 'invalid size';
      }
      this.cols = arg1[0].length;
      if (this.cols === 0) {
        throw 'invalid size';
      }
    }
  }

  // static functions
  // all operations should be constant
  static elementWiseOP(mat: Matrix, callback: (op: number) => number): Matrix;
  static elementWiseOP(mat: Matrix, other, callback: (op1: number, op2: number) => number): Matrix;
  static elementWiseOP(arg1: Matrix, arg2, arg3?): Matrix {
    let mat = new Matrix(arg1.data);

    switch (typeof(arg2)) {
      case 'number':
        for (let i = 0; i < mat.rows; i++) {
          for (let j = 0; j < mat.cols; j++) {
            mat.data[i][j] = arg3(mat.data[i][j], arg2);
          }
        }
        break;
      case 'function':
        for (let i = 0; i < mat.rows; i++) {
          for (let j = 0; j < mat.cols; j++) {
            mat.data[i][j] = arg2(mat.data[i][j]);
          }
        }
        break;
      default: // should be Matrix
        if (!(arg2 instanceof Matrix) || typeof(arg3) !== 'function') {
          throw 'type error';
        }
        if (mat.rows !== arg2.rows || mat.cols !== arg2.cols) {
          throw 'size mismatch';
        }
        for (let i = 0; i < mat.rows; i++) {
          for (let j = 0; j < mat.cols; j++) {
            mat.data[i][j] = arg3(mat.data[i][j], arg2.data[i][j]);
          }
        }
        break;
    }
    return mat;
  }

  static neg(mat: Matrix) {
    return Matrix.elementWiseOP(mat, (op) => {
      return -op;
    });
  }

  static reciprocal(mat: Matrix) {
    return Matrix.elementWiseOP(mat, (op) => {
      return 1 / op;
    });
  }

  static add(mat: Matrix, other): Matrix {
    return Matrix.elementWiseOP(mat, other, (op1, op2) => {
      return op1 + op2;
    });
  }

  static sub(mat: Matrix, other): Matrix {
    return Matrix.elementWiseOP(mat, other, (op1, op2) => {
      return op1 - op2;
    });
  }

  static mul(mat: Matrix, other): Matrix {
    return Matrix.elementWiseOP(mat, other, (op1, op2) => {
      return op1 * op2;
    });
  }

  static div(mat: Matrix, other): Matrix {
    return Matrix.elementWiseOP(mat, other, (op1, op2) => {
      return op1 / op2;
    });
  }

  static transpose(mat: Matrix): Matrix {
    let m = new Matrix(mat.data);
    m.data = Utils.transpose2D(m.data);
    [m.rows, m.cols] = [m.cols, m.rows];
    return m;
  }

  static dot(op1, op2): Matrix {
    return LinAlg.dot(op1, op2);
  }

  static isSquare(mat: Matrix): boolean {
    return mat.rows === mat.cols;
  }

  static isSymmetric(mat: Matrix): boolean {
    if (!Matrix.isSquare(mat)) {
      return false;
    }
    for (let i = 0; i < mat.rows; i++) {
      for (let j = 0; j <= i; j++) {
        if (!Utils.isEqual(mat.data[i][j], mat.data[j][i])) {
          return false;
        }
      }
    }
    return true;
  }

  static isSkewSymmetric(mat: Matrix): boolean {
    if (!Matrix.isSquare(mat)) {
      return false;
    }
    for (let i = 0; i < mat.rows; i++) {
      for (let j = 0; j <= i; j++) {
        if (!Utils.isEqual(mat.data[i][j], -mat.data[j][i])) {
          return false;
        }
      }
    }
    return true;
  }

  static diagonalElements(mat: Matrix): number[] {
    if (!Matrix.isSquare(mat)) {
      throw 'invalid size';
    }
    let ret = [];
    for (let i = 0; i < mat.rows; i++) {
      ret.push(mat.data[i][i]);
    }
    return ret;
  }

  static det(mat: Matrix): number {
    if (!Matrix.isSquare(mat)) {
      throw 'invalid size';
    }
    let ret = 0;
    let y = new Array(mat.rows);
    for (let i = 0; i < mat.rows; i++) {
      y[i] = i;
    }
    Utils.permutation(y, 0, 1, (arr, inv) => {
      let term = inv;
      for (let i = 0; i < mat.rows; i++) {
        term *= mat.data[i][arr[i]];
      }
      ret += term;
    });
    return ret;
  }

  static constructDiag(arr: Array<number>): Matrix {
    let len = arr.length;
    let mat = new Matrix(len);
    for (let i = 0; i < len; i++) {
      mat.data[i][i] = arr[i];
    }
    return mat;
  }

  static identity(n: number): Matrix {
    let diag = new Array(n);
    for (let i = 0; i < n; i++) {
      diag[i] = 1;
    }
    return Matrix.constructDiag(diag);
  }

  static rank(mat: Matrix) {
    let rank = Math.min(mat.rows, mat.cols);
    for (let i = 0; i < rank; i++) {
      if (Utils.isEqual(mat.data[i][i], 0)) {
        for (let j = i + 1; j < mat.rows; j++) {
          let mult = mat.data[j][i] / mat.data[i][i];
          for (let k = i; k < rank; k++) {
            mat.data[j][k] -= mult * mat.data[i][k];
          }
        }
      } else {
        let reduce = true;
        for (let j = i + 1; j < mat.rows; j++) {
          if (Utils.isEqual(mat.data[j][i], 0)) {
            [mat.data[i], mat.data[j]] = [mat.data[j], mat.data[i]];
            reduce = false;
            break;
          }
        }
        if (reduce) {
          rank--;
          for (let j = i; j < mat.rows; j++) {
            mat.data[j][i] = mat.data[j][rank];
          }
        }
        i--;
      }
    }
    return rank;
  }

  static getRow(mat: Matrix, inds: number[] | number): Vector[] | Vector {
    let ret;
    if (typeof(inds) === 'number') {
      if (inds < 0 || inds >= mat.rows) {
        throw 'invalid input';
      } else {
        ret = new Vector(mat.data[inds]);
      }
    } else {
      ret = new Array(inds.length);
      for (let i = 0; i < inds.length; i++) {
        if (inds[i] < 0 || inds[i] >= mat.rows) {
          throw 'invalid input';
        } else {
          ret[i] = new Vector(mat.data[inds[i]]);
        }
      }
    }
    return ret;
  }

  static getCol(mat: Matrix, inds: number[] | number): Vector[] | Vector {
    let ret;
    if (typeof(inds) === 'number') {
      if (inds < 0 || inds >= mat.cols) {
        throw 'invalid input';
      } else {
        ret = new Vector(Utils.columnOf(mat.data, inds));
      }
    } else {
      ret = new Array(inds.length);
      for (let i = 0; i < inds.length; i++) {
        if (inds[i] < 0 || inds[i] >= mat.cols) {
          throw 'invalid input';
        } else {
          ret[i] = new Vector(Utils.columnOf(mat.data, inds[i]));
        }
      }
    }
    return ret;
  }

  static toVector(mat: Matrix, isCol = true): Vector {
    if (isCol && mat.cols === 1) {
      return Matrix.getCol(mat, 0) as Vector;
    } else if (!isCol && mat.rows === 1) {
      return Matrix.getRow(mat, 0) as Vector;
    } else {
      throw 'invalid size';
    }
  }

  static toScalar(mat: Matrix): number {
    if (mat.rows !== 1 || mat.cols !== 1) {
      throw 'this matrix is not 1 by 1';
    } else {
      return mat.data[0][0];
    }
  }

  static SVD_1D(mat: Matrix, maximumIters=200): Vector {
    // The one-dimensional SVD
    let [m, n] = [mat.rows, mat.cols];
    let x = Vector.randomUnitVector(Math.min(m, n));
    let lastVector;

    let B = m > n ? LinAlg.dot(mat.transpose(), mat) : Matrix.dot(mat, mat.transpose());

    for (let i = 0; i<maximumIters; i++) {
      // console.log(i);
      lastVector = x;
      x = LinAlg.dot(B, lastVector).toVector();
      x = x.div(x.norm());

      if (Utils.isEqual(LinAlg.dot(x, lastVector).toScalar(), 1)) {
        break;
      }
    }
    return x;
  }

  static SVD(mat: Matrix, k = 0, maximumIters=200): { U: Matrix; D: Matrix; Vt: Matrix } {
    let m, n;

    let singulars = [];
    let us = [];
    let vs = [];
    [m, n] = [mat.rows, mat.cols];
    if (k === 0 || k > Math.max(m, n)) {
      k = Math.min(m, n);
    }
    let mat_p = m >= n ? mat : mat.transpose();

    for (let i = 0; i < k; i++) {
      let matrixFor1D = mat.copy();
      let singularValue, u, v;
      let sigma;
      for (let j = 0; j < i; j++) {
        [singularValue, u, v] = [singulars[j], us[j], vs[j]];
        matrixFor1D = matrixFor1D.sub(Vector.outer(u, v).mul(singularValue));
      }
      if (m > n) {
        v = Matrix.SVD_1D(matrixFor1D, maximumIters);
        let u_unnormalized = LinAlg.dot(mat_p, v).toVector();
        sigma = u_unnormalized.norm();
        u = u_unnormalized.div(sigma);
      } else {
        u = Matrix.SVD_1D(matrixFor1D, maximumIters);
        let v_unnormalized = LinAlg.dot(mat_p, u).toVector();
        sigma = v_unnormalized.norm();
        v = v_unnormalized.div(sigma);
      }
      singulars.push(sigma);
      us.push(u);
      vs.push(v);
    }

    return {
      U: Vector.toMatrix(us).transpose(),
      D: Matrix.constructDiag(singulars),
      Vt: Vector.toMatrix(vs)
    };
  }

  static pseudoInverse(mat: Matrix, k = 0): Matrix {
    let {U, D, Vt} = Matrix.SVD(mat, k);
    let singularNum = D.rows;
    for (let i = 0; i < singularNum; i++) {
      if (Utils.isEqual(D.data[i][i], 0)) {
        D.data[i][i] = 0;
      } else {
        D.data[i][i] = 1 / D.data[i][i];
      }
    }
    return Vt.transpose().dot(D).dot(U.transpose());
  }

  static leftInverse(mat: Matrix): Matrix {
    if(mat.rank() !== mat.cols) {
      throw 'not a column full rank matrix';
    } else {
      return Matrix.pseudoInverse(mat);
    }
  }

  static rightInverse(mat: Matrix): Matrix {
    if(mat.rank() !== mat.rows) {
      throw 'not a row ful rank matrix';
    } else {
      return Matrix.pseudoInverse(mat);
    }
  }

  static inverse(mat: Matrix): Matrix {
    if(!mat.isSquare()) {
      throw 'not a square matrix';
    } else if(mat.rank() !== mat.rows) {
      throw 'matrix is singular to working percision'
    } else {
      return this.pseudoInverse(mat);
    }
  }

  // member functions
  elementWiseOP(arg1, arg2?): Matrix {
    return Matrix.elementWiseOP(this, arg1, arg2);
  }

  neg(): Matrix {
    return this.elementWiseOP((op) => {
      return -op;
    });
  }

  reciprocal(): Matrix {
    return this.elementWiseOP((op) => {
      return 1 / op;
    });
  }

  add(other): Matrix {
    return Matrix.elementWiseOP(this, other, (op1, op2) => {
      return op1 + op2;
    });
  }

  sub(other: Matrix): Matrix {
    return Matrix.elementWiseOP(this, other, (op1, op2) => {
      return op1 - op2;
    });
  }

  mul(other: Matrix): Matrix {
    return Matrix.elementWiseOP(this, other, (op1, op2) => {
      return op1 * op2;
    });
  }

  div(other: Matrix): Matrix {
    return Matrix.elementWiseOP(this, other, (op1, op2) => {
      return op1 / op2;
    });
  }

  transpose(): Matrix {
    return Matrix.transpose(this);
  }

  dot(other): Matrix {
    return LinAlg.dot(this, other);
  }

  isSquare(): boolean {
    return Matrix.isSquare(this);
  }

  isSymmetric(): boolean {
    return Matrix.isSymmetric(this);
  }

  isSkewSymmetric(): boolean {
    return Matrix.isSkewSymmetric(this);
  }

  copy(): Matrix {
    return new Matrix(this.data);
  }

  diagonalElements(): number[] {
    return Matrix.diagonalElements(this);
  }

  det(): number {
    return Matrix.det(this);
  }

  rank(): number {
    return Matrix.rank(this);
  }

  getRow(inds: number[] | number): Vector[] | Vector {
    return Matrix.getRow(this, inds);
  }

  getCol(inds: number[] | number): Vector[] | Vector {
    return Matrix.getCol(this, inds);
  }

  toVector(isCol = true): Vector {
    return Matrix.toVector(this, isCol);
  }

  toScalar(): number {
    return Matrix.toScalar(this);
  }

  pseudoInverse(k = 0): Matrix {
    return Matrix.pseudoInverse(this, k);
  }

  leftInverse(): Matrix {
    return Matrix.leftInverse(this);
  }

  rightInverse(): Matrix {
    return Matrix.rightInverse(this);
  }

  inverse(): Matrix {
    return Matrix.inverse(this);
  }
}