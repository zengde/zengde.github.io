export default {
  props: ['list','depth','showDepth','show'],
  name:'tree-folder',
  template: `
    <li :class="{'parent_li':list.children}">
        <span :title="title" @click='toggleChildren'><i class="fa " :class="className"></i> {{ list.name }}</span>
        <transition name="fade">
        <ul v-show='showChildren' v-if='list.children'>
            <tree-folder v-for='(item,index) in list.children' :list='item' :show='show' :showDepth='showDepth' :key="index" :depth='depth+1'></tree-folder>
        </ul>
        </transition>
    </li>
  `,
  created() {
        if(this.show){
            //console.dir(this.show)
            //console.log(this.list.id)
            //console.log(this.show.indexOf(this.list.id))
            if(!this.show.find((value,index)=>{
                return value==this.list.id;
            })){
                this.showChildren=false;
            }
        }
        if(this.showDepth&&this.depth>this.showDepth){
            this.showChildren=false;
        }
  },
  computed: {
      className(){
          if(this.list.children){
              return this.depth>0? (this.showChildren? 'fa-minus-circle':'fa-plus-circle'):'fa-folder-open';
          }else{
              return 'fa-leaf';
          }
      },
      title(){
          return this.list.children? (this.showChildren? '点击收回':'点击展开'):'';
      }
  },
  data(){
    return {
        showChildren:true
    }
  },
  methods: {
    toggleChildren(){
        this.showChildren = !this.showChildren;
        if(!this.list.children){
            let parent=this.$parent;
            let depth=this.depth;
            while(depth){
                parent=parent.$parent;
                depth--;
            }
            parent.leafClick(this.list.id);
        }
    }
  }
}
