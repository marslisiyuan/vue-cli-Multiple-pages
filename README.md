# 星愿HTML项目介绍

> 1.0 打包说明

## 1.0 打包说明

``` 
开发者使用Vue前端框架开发，使用脚手架node.js调试
提交至Ali Git中由阿里完成打包发布操作
发布流程大致如下
html-webpack-plugin 插件由HTML编译为ejs文件
编译期间插入sign变量，编译期间产生新的node.js express生产框架并编译依赖
编译完成后由阿里云RDC发布系统批量发布至远端主机，发布结束

```
