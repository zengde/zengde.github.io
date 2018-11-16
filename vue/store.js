const empty = { 
	template: '<div></div>',
	activate:function(done){done();},
};
const Base='/vue/';
const DEBUG=true;

const API={
  category:Base+'json/category.json',
  area:Base+'json/express_data.json',
  uploadThumb:Base+'fakend/upload.html',
  uploadVideo:Base+'fakend/upload.html',
  uploadFile:Base+'fakend/upload.html',
  productDelete:Base+'fakend/upload.html',
}

const store = new Vuex.Store({
  state: {
    baseUrl:Base,
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
});
const mapState=Vuex.mapState;