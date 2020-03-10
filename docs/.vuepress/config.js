module.exports = {
  base: '/learn-blog/',
  title: 'CaffreyGo',
  description: 'Something just like thiss',
  head: [['link', { rel: 'icon', href: '/gift.png' }]],
  themeConfig: {
    nav: [
      { text: 'TypeScript', link: '/typescript/' },
      { text: 'JavaScript', link: '/javascript/' },
      { text: 'Git', link: '/git/' },
      { text: 'HTTP', link: '/http/' },
      { text: 'Note', link: '/basic/' },
      { text: 'Webpack', link: '/webpack/' },
      { text: 'Github', link: 'https://github.com/caffreygo' }
    ],
    sidebar: {
      '/typescript/': ['', 'crawler', 'step2', 'step3'],
      '/javascript/': [''],
      '/webpack/': ['', 'step-2', 'step-3'],
      '/http/': [''],
      '/git/': [''],
      '/basic/': ['', 'promise', 'promiseDemo', 'element', 'css']
    },
    sidebarDepth: 2,
    lastUpdated: 'Last Updated'
  }
};
