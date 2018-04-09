import {Matrix, Vector} from "../dist"

let m1 = new Matrix(
  [
    [1,2,3,4],
    [5,6,7,8],
    [9,10,11,12]
  ]
);

let ret = Matrix.QR(m1);
console.log('Q: ', ret.Q);
console.log('R: ', ret.R);
console.log('QR: ', ret.Q.dot(ret.R));

// let ret = Matrix.LU(m1);
// console.log('L: ', ret.L);
// console.log('U: ', ret.U);
// console.log('LU: ', ret.L.dot(ret.U));
//
// console.log(m1.det());

// console.log(m1.rank());
// console.log(m1);

// let ret = m1.pseudoInverse();
// console.log(ret);
// console.log(ret.dot(m1));

// let m2 = m1.transpose();
// console.log('m1: ', m1);
// let m2 = new Matrix(2, 3);
// console.log('m2: ', m2);
// let m3 = new Matrix(3);
// console.log('m3: ', m3);
// let m4 = Matrix.transpose(m1);
// console.log('m4: ', m4);
//
// console.log('-m1: ', m1.neg());
// console.log('m1 + 1: ', m1.add(1));
// console.log('m1 / 0: ', m1.div(0));
//
// let m2 = new Matrix("asdf");


// let m5 = new Matrix(
//   [
//     [1,2,7,3],
//     [3,4,9,5],
//     [5,6,8,12],
//     [1,5,9,2]
//   ]
// );
//
// let m6 = new Matrix(
//   [
//     [1,2,3],
//     [2,4,7],
//     [23,46,30],
//     [7,14,1]
//   ]
// );

// console.log(Matrix.det(m5));
// console.log(Matrix.rank(m5));
// console.log(Matrix.rank(m6));

// let v1 = new Vector([1,2,3]);
// console.log(v1.toMatrix());
// console.log(m1.dot(v1));
// console.log(m1.dot);

// let ret = Matrix.SVD(m1);
// console.log('U: ', ret.U);
// console.log('D: ', ret.D);
// console.log('Vt: ', ret.Vt);
// console.log(ret.U.dot(ret.D).dot(ret.Vt));
// console.log(Matrix.pseudoInverse(m1));
// console.log('--------------------');
// ret = Matrix.SVD(m2);
// console.log('U: ', ret.U);
// console.log('D: ', ret.D);
// console.log('Vt: ', ret.Vt);
// console.log(ret.U.dot(ret.D).dot(ret.Vt));
// console.log(Matrix.pseudoInverse(m2));
// console.log('--------------------');