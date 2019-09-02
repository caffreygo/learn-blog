module.exports = {
  base: '/learn-blog/',
  title: 'CaffreyGo',
  description: 'Something just like thiss',
  head: [
    ['link', { rel: 'icon', href: '/gift.png' }]
  ],
  themeConfig: {
    nav: [
      { text: 'Webpack', link: '/webpack/' },
      { text: 'Git', link: '/git/' },
      { text: 'Promise', link: '/promise/' },
      { text: 'Github', link: 'https://github.com/caffreygo' },
    ],
    sidebar: {
      '/promise/': [
        '',
      ],
      '/git/': [
        ''
      ],
      '/webpack/': [
        '',
        'step-1',
        'step-4',
        'step-5',
        'note'
      ],

    },
    sidebarDepth: 2,
    lastUpdated: 'Last Updated'
  }
}
