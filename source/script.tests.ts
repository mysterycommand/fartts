import script from './script';

describe('script', () => {
  it('should exist', () => {
    expect(script).toBeDefined();
    expect(script()).toBe(true);
  });
});
