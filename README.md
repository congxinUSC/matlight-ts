# MatLight: A light linear algebra library.

[![Build Status](https://travis-ci.org/congxinUSC/matlight-ts.svg?branch=master)](https://travis-ci.org/congxinUSC/matlight-ts)

Supporting most commonly used linear algebra operations like getting rank and determinant of matrix, **LU**, **QR**, **SVD**, **pseudo-inverse**, etc.

I've searched around npm and github for handy JavaScript linear algebra libraries for my web based robotics simulation project but surprisingly found nothing meets my requirements. So why not build my own!

To make it easier to maintain and update, I chose TypeScript for this project. By default if you install this package from npm you'll get the compiled version which should be able to work with es5.

## Quick start

If you are using this library with npm, simply type:

```
npm i -S matlight
```

The most commonly used features are in Matrix and Vector:

```JavaScript 1.8
var MatLight = require('matlight');

var Matrix = MatLight.Matrix;
var Vector = MatLight.Vector;
console.log(Matrix);
console.log(Vector);
```

You can construct a Matrix with a raw 2-D array and many other methods:

```JavaScript 1.8
// with 2-D array
var m1 = new Matrix([
  [1,2,3,4],
  [5,6,7,8],
  [9,10,11,12]
]);

// zero matrix with height and width
var m2 = new Matrix(2,2); // [[0,0],[0,0]]

// diagonal matrix
var m3 = Matrix.constructDiag([1,2,3]);
```

Simular for Vectors:

```JavaScript 1.8
// with 1-D array
var v1 = new Vector([1,2,3]);

// with length
var v2 = new Vector(4);
```

Element-wise opearations:
```JavaScript 1.8
var m4 = m1.add(1);
// [[2,3,4,5],
//  [6,7,8,9],
//  [10,11,12,13]]
var m5 = m1.mul(3);
```

Decompositions:
```JavaScript 1.8
var SVD = Matrix.SVD(m1);
console.log(SVD.U);
console.log(SVD.D);
console.log(SVD.Vt);
var m1_reconstruct = SVD.U.dot(SVD.D).dot(SVD.Vt);
// should still be 'equal' to m1 (note that floating point inaccuracy always happens)
console.log(m1_reconstruct);
```

All functions are 'constant' ones so you'll never need to worry about messing up the data of Matrices and Vectors. Most of the functions have both static style and member style versions (as long as they make sense), just pick the one you prefer!