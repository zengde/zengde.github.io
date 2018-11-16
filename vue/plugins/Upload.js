export default{
    components:{
        FileUpload: () => import(Base+'plugins/vue-upload/index.js'),
    },
    template:`
    <b-card :header="'上传'+title" 
        header-text-variant="white"
        border-variant="primary" 
        header-bg-variant="primary"
        bg-variant="light">
            <b-row>
                <b-col>
                    <file-upload
                        multiple
                        name='Filedata'
                        drop='#drop-gallery'
                        :extensions='extensions'
                        class="btn btn-outline-info btn-sm"
                        labelClass='mb-0'
                        ref="uploadGallery"
                        v-model="upload.gallery"
                        :post-action="posturl"
                        :input-id='inputid'
                        @drop-active='dropFile'
                        @upload-finish='uploadFinish'>选择文件</file-upload>&nbsp;&nbsp;
                    <b-btn variant="outline-info" size='sm' @click="upload.gallery = []">
                        清空
                    </b-btn>
                </b-col>
                <b-col class='text-right'>
                    <b-btn variant="outline-info" size='sm' @click.prevent="$refs.uploadGallery.active = true">
                        上传
                    </b-btn>
                </b-col>
            </b-row>
            <b-container class='bg-white position-relative' style='min-height:570px;' id='drop-gallery'>
                <b-row class='position-absolute align-items-center text-center' :class="{'bg-dark':upload.galleryDrop}" style='width:100%;height:100%;'>
                    <b-col v-show='!upload.gallery.length && !upload.galleryDrop' cols='12' class='align-middle'>
                        <div class='d-inline'>
                            <i class='fa fa-5x fa-border p-3 text-primary border-primary rounded-circle' :class="icon"></i><p></p>
                        </div>
                        <h4>把{{title}}拖拽到这里</h4>
                        <h5 class='text-secondary'>—— 或 ——</h5>
                        <label for='Filedata' class="btn btn-outline-info">
                            选择文件
                        </label>
                    </b-col>
                    <b-col v-show='upload.galleryDrop'>
                        <div class="drop-active text-white">
                            <h4>释放文件</h4>
                        </div>
                    </b-col>
                </b-row>
                <b-row class='mt-2' style=''>
                    <template v-if="type=='image'">
                    <b-col v-for="(file, index) in upload.gallery" :key="file.id" cols='2' class='mt-3 text-center'>
                        <b-img style='width:92px;height:92px;' thumbnail fluid :src="file.thumb" alt="Thumbnail" />
                        <b-progress height="12px" :value="parseInt(file.progress)" :max="upload.max" show-progress animated></b-progress>
                        <small v-if="file.error">错误：{{file.error}}</small>
                        <small v-else-if="file.success">成功</small>
                        <small v-else-if="file.active">上传中</small>
                        <template v-else>
                            <small class='text-nowrap'>{{file.size | formatSize}} 等待上传</small>
                            <div class='btn position-absolute text-secondary' style='top:-15px;right:0;z-index:1;' @click.prevent="$refs.uploadGallery.remove(file)">
                                <i class='fa fa-times-circle-o fa-2x' title='删除'></i>
                            </div>
                        </template>
                    </b-col>
                    </template>
                    <template v-else>
                    <b-col v-for="(file, index) in upload.gallery" :key="file.id" cols='12' class='mt-3 text-center'>
                        <b-progress height="12px" :value="parseInt(file.progress)" :max="upload.max" show-progress animated></b-progress>
                        <small>{{file.name}}</small>
                        <small v-if="file.error">错误：{{file.error}}</small>
                        <small v-else-if="file.success">成功</small>
                        <small v-else-if="file.active">上传中</small>
                        <template v-else>
                            <small class='text-nowrap'>{{file.size | formatSize}} 等待上传</small>
                            <div class='btn position-absolute text-secondary' style='top:-15px;right:0;z-index:1;' @click.prevent="$refs.uploadGallery.remove(file)">
                                <i class='fa fa-times-circle-o fa-2x' title='删除'></i>
                            </div>
                        </template>
                    </b-col>
                    </template>
                </b-row>
            </b-container>
        </b-card>
    `,
    props:['name','posturl','params','type','inputid'],
    data(){
        return {
            upload:{
                gallery:[],
                galleryDrop:false,
                counter:45,
                max:100,
                success:0,
                error:0
            }
        }
    },
    created() {
        //console.dir(this.type)
    },
    computed:{
        title(){
            return this.type=='image'? '图片':this.type=='video'? '视频':'资料'
        },
        extensions(){
            //accept image/png,image/gif,image/jpeg,image/webp
            switch(this.type){
                case "image":
                    return 'gif,jpg,jpeg,png,webp,bmp';
                case "video":
                    return "avi,flv,mp4,mov,wmv,mkv,m4v";
                default:
                return 'gif,jpg,jpeg,png,webp,bmp,psd,cdr,avi,flv,mp4,mov,wmv,mkv,m4v,doc,docx,pdf,xls,xlsx,ppt,zip,rar';
            }
        },
        icon(){
            return this.type=='image'? 'fa-picture-o':this.type=='video'? 'fa-video-camera':'fa-files-o'
        }
    },
    methods:{
        uploadFinish(){
            this.$emit('uploadAll');
        },
        dropFile(ref,active){
            var name=ref+'Drop';
            this.upload[name]=active;
        },
        popDrag(e){
            
        },
    },
    filters:{
        formatSize:function(size){
            if (size > 1024 * 1024 * 1024 * 1024) {
                return (size / 1024 / 1024 / 1024 / 1024).toFixed(2) + ' TB'
              } else if (size > 1024 * 1024 * 1024) {
                return (size / 1024 / 1024 / 1024).toFixed(2) + ' GB'
              } else if (size > 1024 * 1024) {
                return (size / 1024 / 1024).toFixed(2) + ' MB'
              } else if (size > 1024) {
                return (size / 1024).toFixed(2) + ' KB'
              }
              return size.toString() + ' B'
        }
    }
}