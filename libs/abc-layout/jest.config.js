module.exports = {
  name: 'abc-layout',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/abc-layout',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
