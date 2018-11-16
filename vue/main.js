const app = new Vue({
  router,
  store,
  computed: {
	//es6 对象展开运算符
	...Vuex.mapState([
		'baseUrl'
	]),
  },
}).$mount('#app')