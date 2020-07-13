module.exports = {
  base: '/',
  title: 'CaffreyGo',
  description: 'Something just like thiss',
  head: [['link', { rel: 'icon', href: '/gift.png' }]],
  themeConfig: {
    nav: [
      { text: 'TypeScript', link: '/typescript/' },
      {
        text: '书籍相关',
        ariaLabel: 'JavaScript书籍',
        items: [
          { text: 'JavaScript设计模式与开发实践', link: '/book/designPattern' },
        ]
      },
      { text: 'HTTP', link: '/http/' },
      { text: 'Webpack', link: '/webpack/' },
      { text: 'React', link: '/react/' },
      { text: 'JavaScript', link: '/javascript/' },
      { text: 'Git', link: '/git/' },
      {
        text: '笔记相关',
        ariaLabel: 'note',
        items: [
          { text: '日常笔记', link: '/basic/' },
          { text: '算法', link: '/algorithm/' }
        ]
      },
      { text: 'Github', link: 'https://github.com/caffreygo' }
    ],
    sidebar: {
      '/typescript/': ['', 'crawler', 'step2', 'step3', 'step4', 'step5'],
      '/book/': ['designPattern'],
      '/webpack/': ['', 'step-2', 'step-3', 'step-4', 'step-5'],
      '/react/': ['', 'redux', 'note'],
      '/http/': [''],
      '/algorithm/': [''],
      '/javascript/': ['', 'demo'],
      '/git/': [''],
      '/basic/': ['']
    },
    sidebarDepth: 2,
    lastUpdated: 'Last Updated'
  }
};
