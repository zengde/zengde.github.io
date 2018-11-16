let proeditor={
    document:null
};

export default{
    name:'pageHelp',
    components:{
        
    },
    data() {
        return {
            dataLoaded:false,
            document:'<h3>内容</h3>',
            price:'301234'
        }
    },
    template:
        `
    <div>
        <h3>函数列表</h3>
        <table class="table b-table table-bordered table-striped table-sm">
            <thead class="thead-default">
                <tr>
                    <th width='30%'>名称</th>
                    <th width='30%'>参数</th>
                    <th aria-colindex="3" class="">描述</th>
                </tr>
            </thead>
            <tbody class="">
                <tr class="">
                    <td class="">loadStyles</td>
                    <td class=""><code>stylesheets</code> array css文件url</td>
                    <td class="">异步加载css文件</td>
                </tr>
                <tr class="">
                    <td class="">uSwal</td>
                    <td class=""><code>arguments</code> sweetalert2 参数</td>
                    <td class="">sweetalert2 wrapper</td>
                </tr>
                <tr class="">
                    <td class="">show_notify</td>
                    <td class="">
                        <code>type</code> string 类型<br>
                        <code>message</code> string 信息<br>
                    </td>
                    <td class="">pnotify wrapper</td>
                </tr>
                <tr class="">
                    <td class="">editor</td>
                    <td class="">
                        <code>selector</code> string 选择器<br>
                        <code>options</code> string 选项<br>
                    </td>
                    <td class="">ckeditor5 wrapper</td>
                </tr>
                <tr class="">
                    <td class="">number_format</td>
                    <td class="">
                        <code>num</code> int/string 数字<br>
                        <code>precision</code> int 小数点<br>
                        <code>separator</code> string 分隔符<br>
                    </td>
                    <td class="">数字格式化</td>
                </tr>
                <tr class="">
                    <td class="">FloatAdd</td>
                    <td class="">
                        <code>arg1</code> int/string 数字1<br>
                        <code>arg2</code> int/string 数字2<br>
                    </td>
                    <td class="">浮点数加法运算</td>
                </tr>
                <tr class="">
                    <td class="">FloatMul</td>
                    <td class="">
                        <code>arg1</code> int/string 数字1<br>
                        <code>arg2</code> int/string 数字2<br>
                    </td>
                    <td class="">浮点数乘法运算</td>
                </tr>
                <tr class="">
                    <td class="">pretty</td>
                    <td class="">
                        
                    </td>
                    <td class="">prettify代码高亮</td>
                </tr>
            </tbody>
        </table>

        <h3>loadStyles</h3>
        <b-tabs>
            <b-tab title="源码" active>
<pre class='prettyprint linenums lang-js'>
async function loadStyles(stylesheets) {
    let arr = await Promise.all(stylesheets.map(url => fetch(url)))
    arr = await Promise.all(arr.map(url => url.text()))
    const style = document.createElement('style')
    style.textContent = arr.reduce(
        (prev, fileContents) => prev + fileContents, ''
    )
    document.head.appendChild(style);
    // Do whatever now
}
</pre>
            </b-tab>
            <b-tab title="实例" >
<pre class='prettyprint linenums lang-js'>
loadStyles(['plugins/LightBox.css'])
</pre>
            </b-tab>
        </b-tabs>

        <hr>
        <h3>uSwal</h3>
        <b-tabs>
            <b-tab title="源码" active>
<pre class='prettyprint linenums lang-js'>
function uSwal(...arguments){
    return import(Base+'plugins/sweetalert2-7.24.3/dist/sweetalert2.all.min.js')
    .then(module => {
        return window.Swal(...arguments);
    });
}
//快捷使用
function swal_error(message){
    message=typeof message=='object'? JSON.stringify(message):message;
    uSwal('糟糕...', message, 'error')
}
//快捷使用
function axios_error(error){
    //error=typeof error=='object'? JSON.stringify(error):error;
    error=error.message+"\r\n"+error.response.data;
    uSwal('糟糕...', error, 'error')
}
//快捷使用
function api_error(result){
    uSwal('糟糕...', result.info, 'error');
}
</pre>
            </b-tab>
            <b-tab title="实例" >
<pre class='prettyprint linenums lang-js'>
//完整使用1
uSwal({
    title: "确定要删除吗?",
    text: "删除后不可恢复!",
    type: "error",
    showCancelButton: true,
    confirmButtonClass: "btn-danger",
    confirmButtonText: "删除",
    cancelButtonText: "取消",
    closeOnConfirm: false
}).then(result=>{
    if(result.value){
        return this.$http.get(API.productDelete,{params:{id:1}});
    }
    return false;
}).then(result=>{
    if(result){
        show_notify('删除成功！');
    }
}).catch(error=>{
    swal_error(error);
});

//快捷使用2
swal_error('error');
</pre>
<b-btn @click='delProduct' variant='primary'>查看结果1</b-btn>
<b-btn @click='serror' variant='primary'>查看结果2</b-btn>
            </b-tab>
        </b-tabs>

        <hr>
        <h3>show_notify</h3>
        <b-tabs>
            <b-tab title="源码" active>
<pre class='prettyprint linenums lang-js'>
function show_notify(type,message) {
    import(Base+'plugins/Pnotify.js')
    .then(({default:PNotify})=>{
        if(arguments.length==1){
            message=type;
            type='success'
        }
        var data = {
            styling:'bootstrap4',
            icons:'fontawesome4',
            title: "提示",
            text: message,
            delay:1500,
            stack:{
                'dir1': 'down',
                'firstpos1': 25
            }
            
        };
        switch (type) {
            case 'error':
                data.type = "error";
                break;
            case 'info':
                data.type = "info";
                break;
            case 'success':
                data.type = "success";
                break;
        }
        new PNotify({
            target:document.body,
            data
        });
    })
}
</pre>
            </b-tab>
            <b-tab title="实例" >
<pre class='prettyprint linenums lang-js'>
//使用1
show_notify('error','删除成功！');

//使用2
show_notify('删除成功！');
</pre>
<b-btn @click='n1' variant='primary'>查看结果1</b-btn>
<b-btn @click='n2' variant='primary'>查看结果2</b-btn>
            </b-tab>
        </b-tabs>

        
        <hr>
        <h3>editor</h3>
        <b-tabs>
            <b-tab title="源码" active>
<pre class='prettyprint linenums lang-js'>
function editor(selector,options){
    return import('https://cdn.jsdelivr.net/npm/@ckeditor/ckeditor5-build-classic@11.1.1/build/ckeditor.min.js')
    .then(module => {
        return window.ClassicEditor
            .create(document.querySelector(selector),options)
            //.then( editor => {
                //console.log( editor );
            //} )
    })
}
</pre>
            </b-tab>
            <b-tab title="实例" >
<pre class='prettyprint linenums lang-js'>
editor('#document',{})
.then(editor=>{
    proeditor.product=editor;

    editor.model.document.on( 'change:data', () => {
        this.document=editor.getData();
    });
});
</pre>
<b-form-textarea v-show='dataLoaded' id="document" v-html="document"></b-form-textarea>
<b-btn @click='e1' variant='primary'>查看结果</b-btn>
            </b-tab>
        </b-tabs>


        <hr>
        <h3>number_format</h3>
        <b-tabs>
            <b-tab title="源码" active>
<pre class='prettyprint linenums lang-js'>
function number_format(num, precision, separator) {
    var parts;
    // 判断是否为数字
    if (!isNaN(parseFloat(num)) && isFinite(num)) {
        // 把类似 .5, 5. 之类的数据转化成0.5, 5, 为数据精度处理做准, 至于为什么
        // 不在判断中直接写 if (!isNaN(num = parseFloat(num)) && isFinite(num))
        // 是因为parseFloat有一个奇怪的精度问题, 比如 parseFloat(12312312.1234567119)
        // 的值变成了 12312312.123456713
        num = Number(num);
        // 处理小数点位数
        num = (typeof precision !== 'undefined' ? num.toFixed(precision) : num).toString();
        // 分离数字的小数部分和整数部分
        parts = num.split('.');
        // 整数部分加[separator]分隔, 借用一个著名的正则表达式
        parts[0] = parts[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + (separator || ','));

        return parts.join('.');
    }
    return NaN;
}
</pre>
            </b-tab>
            <b-tab title="实例" >
<pre class='prettyprint linenums lang-js'>
{ { price|numberFormat } }
</pre>
{{price}} 格式化后<i class='text-danger'>￥{{price|numberFormat}}</i>
            </b-tab>
        </b-tabs>


        <hr>
        <h3>FloatAdd FloatMul</h3>
        <b-tabs>
            <b-tab title="源码" active>
<pre class='prettyprint linenums lang-js'>
function FloatAdd(arg1, arg2) {
    var r1, r2, m;
    try {
        r1 = arg1.toString().split(".")[1].length
    } catch(e) {
        r1 = 0
    }
    try {
        r2 = arg2.toString().split(".")[1].length
    } catch(e) {
        r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2));
    return (arg1*m + arg2*m)/m
}
function FloatMul(arg1, arg2) {
    var m = 0,
        s1 = arg1.toString(),
        s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length
    } catch(e) {}
    try {
        m += s2.split(".")[1].length
    } catch(e) {}
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}
</pre>
            </b-tab>
            <b-tab title="实例" >
<pre class='prettyprint linenums lang-js'>
FloatAdd(1.2,5)
</pre>
            </b-tab>
        </b-tabs>

        <hr>
        <h3>pretty</h3>
        <b-tabs>
            <b-tab title="源码" active>
<pre class='prettyprint linenums lang-js'>
function pretty(){
    return import('https://cdn.rawgit.com/google/code-prettify/master/loader/run_prettify.js')
           .then(module=>{
               
           })
}
</pre>
            </b-tab>
            <b-tab title="实例" >
<pre class='prettyprint linenums lang-js'>
pretty()
</pre>
            </b-tab>
        </b-tabs>
        <hr>
        
    </div>
    `,
    created() {
        pretty().then(()=>{
            loadStyles([Base+'pretty.css'])
        });
    },
    methods: {
        delProduct(id){
            uSwal({
                title: "确定要删除吗?",
                text: "删除后不可恢复!",
                type: "error",
                showCancelButton: true,
                confirmButtonClass: "btn-danger",
                confirmButtonText: "删除",
                cancelButtonText: "取消",
                closeOnConfirm: false
            }).then(result=>{
                if(result.value){
                    return this.$http.get(API.productDelete,{params:{id:1}});
                }
                return false;
            }).then(result=>{
                if(result){
                    show_notify('删除成功！');
                }
            }).catch(error=>{
                swal_error(error);
            });
        },
        serror(){
            swal_error('error');
        },
        n1(){
            show_notify('error','删除成功！');
        },
        n2(){
            show_notify('删除成功！');
        },
        e1(){
            editor('#document',{})
            .then(editor=>{
                proeditor.product=editor;
            
                editor.model.document.on( 'change:data', () => {
                    this.document=editor.getData();
                });
            });
        }
    },
    filters:{
        numberFormat(val){
            return number_format(val);
        }
    }
}