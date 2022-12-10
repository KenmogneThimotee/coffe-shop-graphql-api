export default {
    introspection: {
      type: 'sdl',
      paths: ['graphql/docs-schema.graphql'],
    },
    website: {
      template: 'carbon-multi-page',
      options: {
        appTitle: 'Coffee Shop graphql API docs',
        appLogo: 'https://graphql.org/img/og-image.png',
        pages: [{
          title: 'Graphql APIs',
          content: `This is a graphql api documentation`
        }],
      },
    },
  }