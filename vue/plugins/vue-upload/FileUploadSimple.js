import InputFile from './InputFile.js'

var myStylesheets = [Base + 'plugins/vue-upload/FileUpload.css'];

loadStyles(myStylesheets);

export default {
    template: `
  <div>
    <label :class="className" :for="inputId || name">
        <slot></slot>
    </label>
    <input-file class='file-input'></input-file>
  </div>
  `,
    components: {
        InputFile,
    },
    props: {
        inputId: {
            type: String,
        },

        name: {
            type: String,
            default: 'file',
        },

        accept: {
            type: String,
        },

        capture: {
        },

        multiple: {
            type: Boolean,
        },

        //并行模式-一次请求上传所有文件 或者逐个上传
        multipleMode: {
            type: Boolean,
            default: false
        },

        maximum: {
            type: Number,
            default() {
                return this.multiple ? 0 : 1
            }
        },

        directory: {
            type: Boolean,
        },

        postAction: {
            type: String,
        },

        drop: {
            default: false,
        },

        dropDirectory: {
            type: Boolean,
            default: true,
        },

        size: {
            type: Number,
            default: 0,
        },

        extensions: {
            default: Array,
        },

        value: {
            type: Array,
            default: Array,
        },

        labelClass: {
            type: String
        },

        thumb: {
            type: Boolean,
            default: true
        },

        excludes: {
            type: [String, RegExp],
            default: () => /Thumbs\.db|desktop\.ini|\.php5?|\.html?|\.jsx/
        }
    },

    data() {
        return {
            files: [],
            features: {
                html5: true,
                directory: false,
                drag: false,
            },

            active: false,
            dropActive: false,

            uploading: 0,

            destroy: false,
            uploaded: false,

            //multipleMode时
            progress: 0,
            error: '',
            speed: 0,
            response: null
        }
    },


    /**
     * mounted
     * @return {[type]} [description]
     */
    mounted() {
        let input = document.createElement('input')
        input.type = 'file'
        input.multiple = true

        // html5 特征
        if (window.FormData && input.files) {
            // 上传目录特征
            if (typeof input.webkitdirectory === 'boolean' || typeof input.directory === 'boolean') {
                this.features.directory = true
            }

            // 拖拽特征
            if (this.features.html5 && typeof input.ondrop !== 'undefined') {
                this.features.drop = true
            }
        } else {
            this.features.html5 = false
        }

        if (!this.features.html5) {
            throw new Error('Please use modern broswer!');
        }

        // files 定位缓存
        this.maps = {}

        this.$nextTick(function () {

            // 拖拽渲染
            this.watchDrop(this.drop)
        })
    },

    /**
     * beforeDestroy
     * @return {[type]} [description]
     */
    beforeDestroy() {
        // 已销毁
        this.destroy = true

        // 设置成不激活
        this.active = false
    },

    computed: {
        className() {
            return [
                'file-uploads',
                this.features.html5 ? 'file-uploads-html5' : 'file-uploads-html4',
                this.features.directory && this.directory ? 'file-uploads-directory' : undefined,
                this.features.drop && this.drop ? 'file-uploads-drop' : undefined,
                this.labelClass ? this.labelClass : undefined,
            ]
        }
    },

    watch: {
        active(active) {
            this.watchActive(active)
        },
        uploaded(flag) {
            if (flag)
                this.emitFinish();
        },
        uploading(newval, oldval) {
            if (newval == oldval)
                return;
            if (!newval)
                this.emitFinish();
        }
    },

    methods: {

        // 清空
        clear() {
            this.files = []
            // 定位
            this.maps = {}
            return true
        },
        //上传完成后清理数据
        clearData() {
            this.active = false;
            this.progress = 0;
            this.error = '';
            this.speed = 0;
            this.uploading = 0;
            this.response = null;
            this.uploaded = false;
        },

        // 选择
        get(id) {
            if (!id) {
                return false
            }

            if (typeof id === 'object') {
                return this.maps[id.id] || false
            }

            return this.maps[id] || false
        },

        add(files){

            // 最大数量限制
            if (this.maximum > 1 && (files.length + this.files.length) >= this.maximum) {
                return false;
            }
            // 遍历规范对象
            for (let i = 0; i < files.length; i++) {
                let file = files[i]
                if (this.features.html5 && file instanceof Blob) {
                    file = {
                        file,
                        size: file.size,
                        name: file.webkitRelativePath || file.relativePath || file.name || 'unknown',
                        type: file.type,
                        fileObject: true
                    }

                    let extensions = this.extensions
                    if (extensions && (extensions.length || typeof extensions.length === 'undefined')) {
                        if (typeof extensions !== 'object' || !(extensions instanceof RegExp)) {
                            if (typeof extensions === 'string') {
                                extensions = extensions.split(',').map(value => value.trim()).filter(value => value)
                            }
                            extensions = new RegExp('\\.(' + extensions.join('|').replace(/\./g, '\\.') + ')$', 'i')
                        }
                        if (file.name.search(extensions) === -1) {
                            continue;
                        }
                    } else if (this.excludes.test(file.name)) {
                        continue;
                    }

                    if (this.thumb && file.type.substr(0, 6) === 'image/') {
                        let URL = window.URL || window.webkitURL
                        if (URL && URL.createObjectURL) {
                            file.thumb = URL.createObjectURL(file.file);
                        }
                    }
                }
                file = {
                    active: false,
                    error: '',
                    success: false,
                    response: {},
                    ...file,

                    progress: '0.00',          // 只读
                    speed: 0,                  // 只读
                    uploaded: false
                }

                // 必须包含 id
                if (!file.id) {
                    file.id = Math.random().toString(36).substr(2)
                    this.maps[file.id] = file
                }

                this.files.push(file)
                this.emitFile(file, undefined)

                // 最大数量限制
                if (this.maximum === 1) {
                    break
                }
                this.uploading++;
            }

            this.emitInput();
            return true;
        },

        // 添加
        addInputFile(el) {
            if (el.files) {
                this.add(el.files);
            }
        },

        // 添加 DataTransfer
        addDataTransfer(dataTransfer) {
            if (dataTransfer.files.length) {
                this.add(dataTransfer.files);
            }
        },

        // 处理后 事件 分发
        emitFile(newFile, oldFile) {
            this.$emit('input-file', newFile, oldFile)
        },

        emitInput() {
            this.$emit('input', this.files)
        },

        emitFinish() {
            this.$emit('upload-finish');
            this.clearData();
        },

        // 上传
        upload(id) {
            let upfiles = id ? this.get(id) : this.files;
            upfiles = upfiles.filter(file => !file.uploaded);
            if (!upfiles.length)
                return;

            if (this.multipleMode) {
                let form = new window.FormData()

                upfiles.forEach(file => {
                    file.active = true;
                    form.append(this.name, file.file, file.name)
                });

                let xhr = new XMLHttpRequest()
                xhr.open('POST', this.postAction)
                return this.uploadXhr(xhr, null, form)
            } else {
                upfiles.forEach(file => {
                    file.active = true;
                    let form = new window.FormData()
                    form.append(this.name, file.file, file.name)
                    let xhr = new XMLHttpRequest()
                    xhr.open('POST', this.postAction)
                    return this.uploadXhr(xhr, file, form)
                });
            }

        },

        uploadXhr(xhr, file, body) {
            let _file = file ? file : this;

            // 进度条
            xhr.upload.onprogress = (e) => {
                // 还未开始上传 已删除 未激活
                if (!e.lengthComputable) {
                    return
                }
                let progress = (e.loaded / e.total * 100).toFixed(2);
                _file.progress = progress;
            }

            let fn = (e) => {
                switch (e.type) {
                    case 'timeout':
                    case 'abort':
                        _file.error = e.type
                        break;
                    case 'error':
                        if (!xhr.status) {
                            _file.error = 'network'
                        } else if (xhr.status >= 500) {
                            _file.error = 'server'
                        } else if (xhr.status >= 400) {
                            _file.error = 'denied'
                        }
                        break;
                    default:
                        if (xhr.status >= 500) {
                            _file.error = 'server';
                        } else if (xhr.status >= 400) {
                            _file.error = 'denied';
                        } else {
                            _file.progress = '100.00';
                            _file.active = false;
                        }
                }
                _file.uploaded = true;
                if (!this.multipleMode) {
                    this.uploading--;
                }

                if (_file.error) {
                    return false;
                }
                if (xhr.responseText) {
                    let contentType = xhr.getResponseHeader('Content-Type')
                    if (contentType && contentType.indexOf('/json') !== -1) {
                        _file.response = JSON.parse(xhr.responseText)
                    } else {
                        _file.response = xhr.responseText
                    }
                }

            };

            // 事件
            xhr.onload = fn
            xhr.onerror = fn
            xhr.onabort = fn
            xhr.ontimeout = fn

            xhr.send(body);
        },

        watchActive(active) {
            if (active) {
                this.upload();
            }
        },

        watchDrop(_el) {
            let el = _el
            if (!this.features.drop) {
                return
            }

            // 移除挂载
            if (this.dropElement) {
                try {
                    this.dropElement.removeEventListener('dragenter', this.onDragenter, false)
                    this.dropElement.removeEventListener('dragleave', this.onDragleave, false)
                    //document.removeEventListener('drop', this.onDocumentDrop, false)
                    this.dropElement.removeEventListener('dragover', this.onDragover, false)
                    this.dropElement.removeEventListener('drop', this.onDrop, false)
                } catch (e) {
                }
            }

            if (!el) {
                el = false
            } else if (typeof el === 'string') {
                el = document.querySelector(el) || this.$root.$el.querySelector(el)
            } else if (el === true) {
                el = this.$parent.$el
            }

            this.dropElement = el

            if (this.dropElement) {
                this.dropElement.addEventListener('dragenter', this.onDragenter, false)
                this.dropElement.addEventListener('dragleave', this.onDragleave, false)
                //document.addEventListener('drop', this.onDocumentDrop, false)
                this.dropElement.addEventListener('dragover', this.onDragover, false)
                this.dropElement.addEventListener('drop', this.onDrop, false)
            }
        },


        onDragenter(e) {
            e.preventDefault()
            if (this.dropActive) {
                return
            }
            if (!e.dataTransfer) {
                return
            }
            let dt = e.dataTransfer
            if (dt.files && dt.files.length) {
                this.dropActive = true
            } else if (!dt.types) {
                this.dropActive = true
            } else if (dt.types.indexOf && dt.types.indexOf('Files') !== -1) {
                this.dropActive = true
            } else if (dt.types.contains && dt.types.contains('Files')) {
                this.dropActive = true
            }
        },

        onDragleave(e) {
            e.preventDefault()
            if (!this.dropActive) {
                return
            }
            if (e.target.nodeName === 'HTML' || e.target === e.explicitOriginalTarget || (!e.fromElement && (e.clientX <= 0 || e.clientY <= 0 || e.clientX >= window.innerWidth || e.clientY >= window.innerHeight))) {
                this.dropActive = false
            }
        },

        onDragover(e) {
            e.preventDefault()
        },

        onDocumentDrop() {
            this.dropActive = false
        },

        onDrop(e) {
            e.preventDefault();
            this.addDataTransfer(e.dataTransfer)
            //console.dir(e.dataTransfer.files);
            //console.dir(e.dataTransfer.items);
            //console.dir(e.dataTransfer.types);
        },
    }
}
