import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow'
import Search from '../components/Search.js';

//test to check if Search component renders without crashing
it("Search renders without crashing", () => {
  const renderer = new ShallowRenderer();
  renderer.render(<Search />);
  renderer.getRenderOutput();
});