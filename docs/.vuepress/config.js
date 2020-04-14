module.exports = {
  base: '/learn-blog/',
  title: 'CaffreyGo',
  description: 'Something just like thiss',
  head: [['link', { rel: 'icon', href: '/gift.png' }]],
  themeConfig: {
    nav: [
      { text: 'TypeScript', link: '/typescript/' },
      { text: 'JavaScript', link: '/javascript/' },
      { text: 'HTTP', link: '/http/' },
      { text: 'Webpack', link: '/webpack/' },
      { text: 'Git', link: '/git/' },
      { text: 'Note', link: '/basic/' },
      { text: 'Github', link: 'https://github.com/caffreygo' }
    ],
    sidebar: {
      '/typescript/': ['', 'crawler', 'step2', 'step3', 'step4', 'step5'],
      '/javascript/': ['', 'demo'],
      '/webpack/': ['', 'step-2', 'step-3', 'step-4', 'demo'],
      '/http/': [''],
      '/git/': [''],
      '/basic/': ['']
    },
    sidebarDepth: 2,
    lastUpdated: 'Last Updated'
  }
};
