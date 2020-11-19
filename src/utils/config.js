const IS_DEV = process.env.NODE_ENV == 'development'

// 项目接口前缀
// export const BASEURL = IS_DEV ? 'athena' : location.origin + location.pathname.match(/\/\w+/g)[0]
// export const BASEURL = IS_DEV ? 'lbxyh' : location.origin + location.pathname.match(/\/\w+/g)[0]
// export const BASEURL = IS_DEV ? 'hyzs' : location.origin + location.pathname.match(/\/\w+/g)[0]
export const BASEURL = IS_DEV ? 'wghjy' : location.origin + location.pathname.match(/\/\w+/g)[0]
// export const BASEURL = IS_DEV ? 'accelerator_test' : location.origin + location.pathname.match(/\/\w+/g)[0]

// 截取到的内容示例："http://x.wego168.com/hyzs"
export const projectUrl = IS_DEV ? location.origin + '/' + BASEURL : BASEURL

// 图片前缀
export const IMGURL = 'http://athena-1255600302.cosgz.myqcloud.com'

// 默认头像
export const DEFAULTHEADERIMAGE = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
