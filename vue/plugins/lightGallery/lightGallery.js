import 'https://cdn.jsdelivr.net/combine/npm/lightgallery.js@1/dist/js/lightgallery.min.js,npm/lg-zoom.js@1/dist/lg-zoom.min.js,npm/lg-fullscreen.js@1/dist/lg-fullscreen.min.js,npm/lg-thumbnail.js@1/dist/lg-thumbnail.min.js,npm/lg-autoplay.js@1/dist/lg-autoplay.min.js';
LoadCSS('https://cdn.jsdelivr.net/npm/lightgallery.js@1/dist/css/lightgallery.min.css')

export default {
    name:'lightGallery',
    template:`
    <div :id="id" class="list-unstyled justified-gallery"></div>
    `,
    props:{
        images: {
		  type: Array,
		  required: true,
		},
        id:{
            type:String,
            default:'lightgallery'
        }
    },
    data(){
        return {

        }
    },
    methods:{
        showImage(index) {
            var lg=document.getElementById(this.id);
			lg.addEventListener('onAfterOpen', function(event){
				document.querySelector('iframe.lg-object').setAttribute('scrolling','no');
			}, {once:true});
            if (lg.getAttribute('lg-uid')) {
                window.lgData[lg.getAttribute('lg-uid')].s.index=index;
            }
            window.lightGallery(lg, {
                dynamic: true,
                dynamicEl: this.images,
                index:index,
                preload:0,
				iframeMaxWidth:'70%'
            });
        }
    }
}