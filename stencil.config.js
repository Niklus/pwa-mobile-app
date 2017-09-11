exports.config = {
  bundles: [
    { components: ['app-main','app-nav']},
    { components: ['app-list','app-detail','snack-bar'] }
  ],
  collections: [
    { name: '@stencil/router' }
  ]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
}
