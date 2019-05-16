export default {
    components:{
		LightBox: () => import(Base+'plugins/lightGallery/lightGallery.js'),
	},
    props:[],
    data(){
        return {
            imgs:[{
				src:'1.jpg',
				thumb:'thumb-1.jpg',
				info:[600,800],
				realname:'admin'
			},{
				src:'2.jpg',
				thumb:'thumb-2.jpg',
				info:[600,800],
				realname:'admin'
			},{
				src:'13.jpg',
				thumb:'thumb-13.jpg',
				info:[600,800],
				realname:'admin'
			}],
			videos:[{
				//src:'http://h5player.bytedance.com/video/mp4/xgplayer-demo-720p.mp4',
				src:'embed.html',
				thumb:'//s2.pstatp.com/cdn/expire-1-M/byted-player-videos/1.0.0/poster.jpg',
				duration:'00:02:01',
				realname:'admin'
			}],
        };
    },
    created(){
        
    },
    template:`
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
                    <td class="">images</td>
                    <td class=""><code>array</code></td>
                    <td class="">图片或iframe数组</td>
                </tr>
            </tbody>
        </table>
		
		<h3>methods</h3>
        <table class="table b-table table-striped table-sm">
            <thead class="thead-default">
                <tr>
                    <th width='30%'>名称</th>
                    <th width='30%'>参数</th>
                    <th aria-colindex="3" class="">描述</th>
                </tr>
            </thead>
            <tbody class="">
                <tr class="">
                    <td class="">showImage</td>
                    <td class=""><code>index</code> 起始索引</td>
                    <td class="">显示组件</td>
                </tr>
            </tbody>
        </table>
		
		<h3>示例(点击图片显示lightgallery)</h3>
        <b-tabs>
            <b-tab title="图片" active>
                <b-card-group columns>
					<b-card no-body v-for="(v,k) in imgs" :key="v.img_id"
					@click="openGallery(k)">
						<b-card-img :src="baseUrl+'assets/imgs/'+v.src" title="点击查看大图" alt="点击查看大图" fluid top />
						<b-card-body>图片尺寸：{{v.info[0]}}*{{v.info[1]}}</b-card-body>
						<div slot='footer' class='text-muted'>
							上传者：{{v.realname}}
						</div>
					</b-card>
				</b-card-group>
            </b-tab>
            <b-tab title="iframe" >
                <b-card-group columns>
					<b-card no-body v-for="(v,k) in videos" :key="v.img_id"
					@click="openVideo(k)">
						<b-card-img :src="v.thumb" title="点击播放视频" alt="点击播放视频" fluid top />
						<b-card-body>时长：{{v.duration}}</b-card-body>
						<div slot='footer' class='text-muted'>
							上传者：{{v.realname}}
						</div>
					</b-card>
				</b-card-group>
            </b-tab>
        </b-tabs>
		
        
		<LightBox 
            :images="modalGallerys" 
            ref="lightbox"
            :show-caption="true"
            :show-thumbs="true"
            :show-light-box="false">
        </LightBox>
		<LightBox 
			id="lightboxVideo"
            :images="modalVideos" 
            ref="lightboxVideo"
            :show-caption="false"
            :show-thumbs="true">
        </LightBox>
    </div>
    `,
    computed:{
        ...Vuex.mapState([
            'baseUrl'
        ]),
        modalGallerys(){
            var arr=[];
            this.imgs.forEach((value,index)=>{
                let obj={
                    subHtml:'图片尺寸：'+value.info[0]+'*'+value.info[1]+'<br>'+'上传者:'+value.realname,
                    thumb:this.baseUrl+'assets/imgs/'+value.thumb,
                    src:this.baseUrl+'assets/imgs/'+value.src
                };
                arr.push(obj);
            });
            return arr;
        },
		modalVideos(){
            var arr=[];
            this.videos.forEach((value,index)=>{
                let obj={
                    subHtml:'',
                    thumb:value.thumb,
                    src:this.baseUrl+value.src,
					iframe:true
                };
                arr.push(obj);
            });
            return arr;
        }
    },
    methods:{
        openGallery(index) {
            this.$refs.lightbox.showImage(index)
        },
		openVideo(index) {
			this.$refs.lightboxVideo.showImage(index);
        },
		play(data,index){
            return Object.assign(this.config,{url:data.src,poster:data.thumb});
        }
    }
}