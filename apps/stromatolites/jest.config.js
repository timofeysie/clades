module.exports = {
  name: 'stromatolites',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/stromatolites',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
