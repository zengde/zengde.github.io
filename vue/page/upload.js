export default{
    name:'pageUpload',
    components:{
        empty,
        Upload: () => import(Base+'plugins/Upload.js'),
    },
    data() {
        return {
            pid:1,
            tabIndex:0,
            modal:{
                galleryUpload:{title:'',component:'Upload',iframecomponent:'Upload',params:null},
                galleryUpload2:{title:'',component:'empty',iframecomponent:'Upload',params:null},
                videoUpload:{title:'',component:'empty',iframecomponent:'Upload',params:null},
                fileUpload:{title:'',component:'empty',iframecomponent:'Upload',params:null},
            },
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
                    <td class="">posturl</td>
                    <td class="">String</td>
                    <td class="">上传地址</td>
                </tr>
                <tr class="">
                    <td class="">type</td>
                    <td class="">String</td>
                    <td class="">(image,video,file)</td>
                </tr>
                <tr class="">
                    <td class="">inputid</td>
                    <td class="">String</td>
                    <td class="">多个上传组件时需设置id</td>
                </tr>
            </tbody>
        </table>

        <h3>events</h3>
        <table class="table b-table table-striped table-sm">
            <thead class="thead-default">
                <tr>
                    <th width='30%'>事件</th>
                    <th width='30%'>参数</th>
                    <th>描述</th>
                </tr>
            </thead>
            <tbody class="">
                <tr class="">
                    <td class="">uploadAll</td>
                    <td class=""></td>
                    <td class="">上传完成事件</td>
                </tr>
            </tbody>
        </table>

        <h3>示例</h3>
        <b-tabs v-model='tabIndex'>
            <b-tab title="图片上传" active>
                <keep-alive>
                    <component ref="galleryUploadCom" v-bind:is="modal.galleryUpload.component" :posturl.sync="galleryUploadUrl" type='image' inputid='filedata_image' @uploadAll='challs_flash_onCompleteAll'></component>
                </keep-alive>
            </b-tab>
            <b-tab title="视频上传" >
                <keep-alive>
                    <component ref="videoUploadCom" v-bind:is="modal.videoUpload.component" :posturl.sync="videoUploadUrl" type='video' inputid='filedata_video' @uploadAll='challs_flash_onCompleteVideo'></component>
                </keep-alive>
            </b-tab>
            <b-tab title="文件上传">
                <keep-alive>
                    <component ref="fileUploadCom" v-bind:is="modal.fileUpload.component" :posturl.sync="fileUploadUrl" type='file' inputid='filedata_file' @uploadAll='challs_flash_onCompleteFile'></component>
                </keep-alive>
            </b-tab>
            <b-tab title="Modal">
                <hr>
                <b-btn variant="outline-primary" @click="openModal('galleryUpload2')">
                    <i class='fa fa-cloud'></i> 上传图片
                </b-btn>
            </b-tab>
        </b-tabs>
        <hr>
        <b-modal size='lg' centered ref="galleryUpload2" @hide="resetModal" title="上传图片" ok-only ok-title="关闭" @ok.prevent="uploadCom('galleryUpload2')">
            <keep-alive>
                <component ref="galleryUploadCom2" v-bind:is="modal.galleryUpload2.component" :posturl.sync="galleryUploadUrl" type='image' inputid='filedata_image2' @uploadAll='challs_flash_onCompleteAll'></component>
            </keep-alive>
        </b-modal>
    </div>
    `,
    created() {

    },
    computed:{
        galleryUploadUrl(){
            return API.uploadThumb+'/id/'+this.pid
        },
        videoUploadUrl(){
            return API.uploadVideo+'/id/'+this.pid
        },
        fileUploadUrl(){
            return API.uploadFile+'/id/'+this.pid
        },
    },
    watch:{
		tabIndex(newVal,oldVal){
            if(newVal>0&&newVal<3){
                let arr=['galleryUpload','videoUpload','fileUpload'];
                let key=arr[newVal];
                if(this.modal[key].component=='empty'){
                    this.modal[key].component=this.modal[key].iframecomponent;
                }
            }
		}
	},
    methods: {
        resetModal(){

        },
        openModal(type,params){
			if(this.modal[type].component=='empty')
				this.modal[type].component=this.modal[type].iframecomponent;
			this.modal[type].params=params;
			this.$refs[type].show();
        },
        uploadCom(ref){
            this.$refs[ref].hide();
        },
        challs_flash_onCompleteAll(){
            this.$refs['galleryUpload'].hide();
            uSwal({
				title: "全部文件上传成功，请选择下一步的操作",
				type: "success",
				showCancelButton: true,
				confirmButtonClass: "btn-success",
				confirmButtonText: "相册列表",
				cancelButtonText: "关闭"
			}).then(result=>{
                if (result.value){
                    show_notify('打开相册列表');
                }
            })
        },
        challs_flash_onCompleteVideo(){
            this.$refs['videoUpload'].hide();
            show_notify('上传完成！');
        },
        challs_flash_onCompleteFile(){
            this.$refs['fileUpload'].hide();
            show_notify('上传完成！');
        }
    }
}