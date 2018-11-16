loadStyles([Base+'plugins/tree/style.css']);

export default {
  props: ['list','show','showDepth'],
  components: {
    treeFolderContents: () => import(Base + 'plugins/tree/folder.js')
  },
  template: `<div class="tree well">
    <ul>
      <tree-folder-contents v-for='(item,index) in list' :list='item' :depth='0' :show='show' :showDepth='showDepth' :key="index"></tree-folder-contents>
    </ul>
  </div>`,
  methods:{
      leafClick(id){
        this.$emit('treeClick',id);
      }
  }
}
