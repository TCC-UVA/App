import * as ReactQuery from '@tanstack/react-query';
import '@testing-library/react-native/extend-expect';
require('react-native-reanimated').setUpTests();
jest.mock('@tanstack/react-query', () => {
  const original: typeof ReactQuery = jest.requireActual(
    '@tanstack/react-query',
  );
  return {
    ...original,
  };
});
