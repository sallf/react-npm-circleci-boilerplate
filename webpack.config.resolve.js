const path = require('path');

// https://github.com/electron-react-boilerplate/electron-react-boilerplate/issues/1321#issuecomment-349767539
module.exports = {
  resolve: {
    alias: {
      $common: path.resolve(__dirname, 'src/common/'),
    },
    extensions: ['*', '.js', '.json', '.jsx'],
  },
};
