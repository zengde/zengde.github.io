const NotFound = { template: '<div><center><h1>页面不存在！</h1></center></div>' }
//const Home=() => import(Base+'page/home.js');
const Tree=() => import(Base+'page/tree.js');
const Upload=() => import(Base+'page/upload.js');
const Area=() => import(Base+'page/area.js');
const Help=() => import(Base+'page/help.js');

const routes = [
  { path: '*',name:'404', component: NotFound },
  { path: '/',name:'home', component: Tree },
  { path: '/tree',name:'tree', component: Tree,meta:{title:'vue-tree 树组件'} },
  { path: '/upload',name:'upload', component: Upload,meta:{title:'vue-upload 上传组件'} },
  { path: '/area',name:'area', component: Area,meta:{title:'vue-area 地区选择组件'} },
  { path: '/help',name:'help', component: Help,meta:{title:'助手函数'} },
]
//懒加载 component: (resolve) => require(['./views/index.vue'], resolve)

// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new VueRouter({
  routes, // （缩写）相当于 routes: routes
  //mode: 'history',
})

router.beforeEach((to, from, next) => {
  let routeName = to.meta.title||'';
  window.document.title = (routeName ? routeName + ' - ' : '') + 'zengde.github';

  next();
})
