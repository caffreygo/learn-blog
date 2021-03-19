module.exports = {
  base: "/",
  title: "Jerry Chen",
  description: "Jerry Chen的博客",
  head: [["link", { rel: "icon", href: "/icon.png" }]],
  markdown: {
    lineNumbers: false,
  },
  themeConfig: {
    lastUpdated: "最后更新时间",
    sidebar: "auto",
    nav: [
      {
        text: "TypeScript",
        ariaLabel: "TypeScript",
        items: [
          { text: "语法学习", link: "/typescript/grammar/" },
          { text: "爬虫实现", link: "/typescript/crawler/" },
        ],
      },
      {
        text: "书籍相关",
        ariaLabel: "JavaScript书籍",
        items: [
          { text: "JavaScript设计模式与开发实践", link: "/book/designPattern" },
          {
            text: "学习JavaScript数据结构与算法",
            link: "/book/dataStructures",
          },
        ],
      },
      { text: "HTTP", link: "/http/" },
      { text: "Node", link: "/node/" },
      { text: "Webpack", link: "/webpack/" },
      { text: "React", link: "/react/" },
      {
        text: "Vue",
        ariaLabel: "Vue.js",
        items: [
          { text: "Vue.js基础", link: "/vue/basic" },
          { text: "Vue.js动画", link: "/vue/animation" },
          { text: "高级语法", link: "/vue/advanced" },
        ],
      },
      { text: "JavaScript", link: "/javascript/" },
      { text: "Git", link: "/git/" },
      {
        text: "笔记相关",
        ariaLabel: "note",
        items: [
          { text: "日常笔记", link: "/basic/" },
          { text: "算法", link: "/algorithm/" },
        ],
      },
      { text: "Github", link: "https://github.com/caffreygo" },
      {
        text: "Vue源码课程",
        link: "https://ustbhuangyi.github.io/vue-analysis/v2/prepare/",
      },
    ],
    sidebar: {
      "/typescript/grammar/": ["", "advanced", "final"],
      "/typescript/crawler/": ["", "express", "final"],
      "/book/": ["designPattern", "dataStructures"],
      "/webpack/": ["", "step-2", "step-3", "step-4", "step-5"],
      "/react/": ["", "redux", "note"],
      "/vue/": ["basic", "animation", "advanced"],
      "/node/": [""],
      "/http/": [""],
      "/algorithm/": [""],
      "/javascript/": ["", "mdn", "demo"],
      "/git/": [""],
      "/basic/": [""],
    },
    sidebarDepth: 2,
    lastUpdated: "Last Updated",
  },
};
