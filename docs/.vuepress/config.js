module.exports = {
  base: '/learn-blog/',
  title: 'CaffreyGo',
  description: 'Something just like thiss',
  head: [
    ['link', { rel: 'icon', href: '/gift.png' }]
  ],
  themeConfig: {
    nav: [
      { text: 'Daily', link: '/daily/' },
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
      '/daily/': [
        '',
        'step-4',
        'note'
      ],

    },
    sidebarDepth: 2,
    lastUpdated: 'Last Updated'
  }
}
