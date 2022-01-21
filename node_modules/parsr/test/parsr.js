const parsr = require('../parsr');
const expect = require('chai').expect;

describe('Parsr', () => {
  it('should do basic capturing', () => {
    expect(parsr('{a}/{b}')('habla/espanol')).to.deep.equal({
      a: 'habla',
      b: 'espanol',
    });
  });
});
