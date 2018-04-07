export class Utils {

  static EPSILON = 1e-15;

  static isEqual(op1: number, op2: number): boolean {
    return Math.abs(op1 - op2) < Utils.EPSILON;
  }

  static permutation(arr: Array<number>, index: number, inv: number, callback) {
    let _len = arr.length;
    if (_len === index) {
      callback(arr, inv);
    } else {
      for (let i = index; i < _len; i++) {
        [arr[i], arr[index]] = [arr[index], arr[i]];
        Utils.permutation(arr, index + 1, inv * (i === index ? 1 : -1), callback);
        [arr[i], arr[index]] = [arr[index], arr[i]];
      }
    }
  }

  static columnOf(arr: Array<Array<number>>, i: number): Array<number> {
    return arr.map(x => x[i]);
  }

  static transpose2D(arr: Array<Array<number>>): Array<Array<number>> {
    return arr[0].map((col, i) => arr.map(row => row[i]));
  }

}
