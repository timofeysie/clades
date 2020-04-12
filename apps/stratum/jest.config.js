module.exports = {
  name: 'stratum',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/stratum',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
