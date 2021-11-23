module.exports = {
  plugins: [
    require('postcss-pxtorem')({
      rootValue: 37.5,
      propList: ['*'],
      selectorBlackList: ['.norem'], // 过滤掉.norem一开头的class,步进行rem转换
    }),
  ],
};
