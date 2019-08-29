module.exports = {
  base: '/',
  title: 'CaffreyGo',
  description: 'Something just like thiss',
  themeConfig: {
    nav: [
      { text: 'Webpack', link: '/daily/' },
      { text: 'Git', link: '/git/' },
      { text: 'Promise', link: '/promise/' },
      { text: 'Github', link: 'https://github.com/caffreygo' },
    ],
    sidebar: {
      '/daily/': [
        ''
      ],
      '/promise/': [
        ''
      ],
      '/git/': [
        ''
      ],

    },
    sidebarDepth: 2
  }
}
