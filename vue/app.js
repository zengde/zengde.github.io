//https://stackoverflow.com/questions/24923479/can-es6s-module-loader-also-load-assets-html-css
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
function uSwal(...arguments){
    return import(Base+'plugins/sweetalert2-7.24.3/dist/sweetalert2.all.min.js')
    .then(module => {
        return window.Swal(...arguments);
    });
}
function swal_error(message){
    message=typeof message=='object'? JSON.stringify(message):message;
    uSwal('糟糕...', message, 'error')
}
function axios_error(error){
    //error=typeof error=='object'? JSON.stringify(error):error;
    error=error.message+"\r\n"+error.response.data;
    uSwal('糟糕...', error, 'error')
}
function api_error(result){
    uSwal('糟糕...', result.info, 'error');
}
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

function pretty(){
    return import('https://cdn.rawgit.com/google/code-prettify/master/loader/run_prettify.js')
           .then(module=>{
               
           })
}

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

//浮点数加法运算
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
//浮点数乘法运算
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
