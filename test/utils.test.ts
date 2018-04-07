import * as mocha from 'mocha';
import * as chai from 'chai';

import {Utils} from "../src";

chai.should();

describe('Utility', () => {
  describe('#isEqual()', () => {
    it('isEqual comparator', () => {
      Utils.isEqual(0.2-0.3+0.1, 0).should.equal(true);
    });
  });
});