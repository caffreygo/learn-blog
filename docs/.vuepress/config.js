module.exports = {
  base: '/learn-blog/',
  title: 'CaffreyGo',
  description: 'Something just like thiss',
  head: [
    ['link', { rel: 'icon', href: '/gift.png' }]
  ],
  themeConfig: {
    nav: [
      { text: 'Git', link: '/git/' },
      { text: 'Daily', link: '/daily/' },
      { text: 'Promise', link: '/promise/' },
      { text: 'Github', link: 'https://github.com/caffreygo' },
    ],
    sidebar: {
      '/daily/': [
        '',
        'note'
      ],
      '/promise/': [
        '',
      ],
      '/git/': [
        ''
      ],

    },
    sidebarDepth: 2,
    lastUpdated: 'Last Updated'
  }
}
