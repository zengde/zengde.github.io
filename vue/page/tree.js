export default{
    name:'pageTree',
    components:{
        tree:()=>import(Base+'plugins/tree/index.js')
    },
    data() {
        return {
            list:[],
            dataLoaded:false
        }
    },
    template:
        `
    <div>
        <h3>props</h3>
        <table class="table b-table table-striped table-sm">
            <thead class="thead-default">
                <tr>
                    <th width='30%'>属性</th>
                    <th width='30%'>类型</th>
                    <th>描述</th>
                </tr>
            </thead>
            <tbody class="">
                <tr class="">
                    <td class="">showDetpth</td>
                    <td class="">int</td>
                    <td class="">最多展开层级</td>
                </tr>
                <tr class="">
                    <td class="">show</td>
                    <td class="">array</td>
                    <td class="">只展开指定分类中的数据</td>
                </tr>
            </tbody>
        </table>

        <h3>events</h3>
        <table class="table b-table table-striped table-sm">
            <thead class="thead-default">
                <tr>
                    <th width='30%'>事件</th>
                    <th width='30%'>参数</th>
                    <th aria-colindex="3" class="">描述</th>
                </tr>
            </thead>
            <tbody class="">
                <tr class="">
                    <td class="">treeClick</td>
                    <td class=""><code>id</code> 分类id</td>
                    <td class="">叶子点击事件</td>
                </tr>
            </tbody>
        </table>

        <h3>示例</h3>
        <b-tabs>
            <b-tab title="全部展开" active>
                <tree v-if='dataLoaded' :list='list'></tree>
            </b-tab>
            <b-tab title="展开部分" >
                <tree v-if='dataLoaded' :list='list' :showDepth='1' :show='[1,2,3]'></tree>
            </b-tab>
            <b-tab title="点击事件">
                <tree v-if='dataLoaded' :list='list' @treeClick='leafClick'></tree>
            </b-tab>
        </b-tabs>
    </div>
    `,
    created() {
        this.fetch();
    },
    methods: {
        test(data,depth){
            let darr=['分类','子分类','小分类','四级分类','五级分类','六级分类'];
            for(var i in data){
                let t1=data[i];
                t1.name=darr[depth]+i;
                if(t1.children){
                    this.test(t1.children,depth+1);
                }
            }
        },
        fetch() {
            return this.$http.get(API.category).then((data) => {
                const result = data.data;
                this.list=result.list;
                //this.test(result.list,0)
                this.dataLoaded=true;
            }).catch(error => {
                swal_error(error);
            })
        },
        leafClick(id){
            show_notify('点击了分类：'+id);
        },
    }
}