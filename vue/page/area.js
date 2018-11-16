export default{
    name:'pageArea',
    components:{
        empty,
        
    },
    data() {
        return {
            dataLoaded:false,
            express:{
				selected:1,//物流方
				tabIndex:0,
				show:false,
				showProvince:true,
				showCity:false,
				showDistrict:false,
				weightprice:0,
				sizeprice:0,
				curexpress:{
					sizeprice:0,
					weightprice:0,
					flag:false
				},
				province: 0,
				city: 0,
				district: 0,
				provinceList: {},
				cityList: {},
				districtList: {},
				search:"",
				stylesheet:{
					"max-width": "230px",
					"text-overflow": "ellipsis",
					"white-space": "nowrap",
					"overflow": "hidden",
					"line-height": "1.4rem",
					"display":"inline-block"
				},
				info: {}
            },
            product:{
                lwh:'L988*W1750*H2090',
                packagesize:null,
                weight:'100'
            }
        }
    },
    template:
        `
    <div>
        
        <h3>示例</h3>
        <div id="expressdetail">
            <div class='tb-meta'>
                <div class="tb-delivery tm-clear">
                    <span class="">
                        物流费：
                    </span>
                    <span class="position-relative">
                        <b-button variant="outline-secondary" id="J_dqPostAgeCont" class="tb-postAgeCont" @click="express.show=!express.show">
                            至 {{express_address}} <i class="fa fa-caret-down"></i>
                        </b-button>

                        <span v-html="calculatexpress">
                            
                        </span>
                        <div class="position-absolute" v-show="express.show" style="width: 30rem;top:33px;left:0;z-index:1;">
                            <b-card header-bg-variant="light" border-variant="secondary" header-class="py-1">
                                <div class="" slot="header">
                                    <div class="float-left">
                                        <span class="mt-1 d-inline-block" :style="[express.stylesheet]">{{express_address}}</span>
                                    </div>
                                    <div class="float-right">
                                        <b-button class='p-0' variant="link" @click="clear"> <i class="fa fa-trash"></i> 重置</b-button>
                                        <b-button class='p-0' variant="link" @click="ok"> <i class="fa fa-check"></i> 确定</b-button>
                                    </div>
                                </div>
                                <b-form-input v-model.trim="express.search" type="text" placeholder="搜索" class="mb-2"></b-form-input>
                                <b-tabs v-model="express.tabIndex">
                                    <b-tab title="省/直辖市" active>
                                        <b-button variant="link" :key="k" :disabled="k==express.province" @click="provinceSelected(k)" v-for="(v,k) in express.provinceList">
                                            {{v.name}}
                                        </b-button>
                                    </b-tab>
                                    <b-tab title="市/区" :title-item-class="{'d-none':!express.showCity}">
                                        <b-button variant="link" :key="k" :disabled="k==express.city" @click="citySelected(k)" v-for="(v,k) in express.cityList[express.province]">
                                            {{v.name}}
                                        </b-button>
                                        <p v-show='!express.province'>请先选择 省/直辖市</p>
                                    </b-tab>
                                    <b-tab title="区/县" :title-item-class="{'d-none':!express.showDistrict}">
                                        <b-button variant="link" :key="k" :disabled="k==express.district" @click="districtSelected(k)" v-for="(v,k) in express.districtList[express.city]">
                                            {{v.name}}
                                        </b-button>
                                        <p v-show='!express.city'>请先选择 市/区</p>
                                    </b-tab>
                                </b-tabs>
                            </b-card>
                        </div>

                    </span>
                </div>
            </div>
        </div>
    </div>
    `,
    created() {
        this.fetchExpress();
    },
    computed:{
        express_size(){
			return this.calculatesizevolumn(this.product.lwh);
		},
		calculatexpress(){
			if(!this.express.curexpress.flag){
				return '此地区无指定物流信息';
			}
			let size=this.product.lwh;
			let packagesize=this.product.packagesize;
			let weight=this.product.weight;
			if(packagesize==''&&size==''&&weight=='')
				return '没有尺寸及重量信息，无法为您计算';
            let sprice=0;
			let wprice=0;
			let volumn1=this.calculatesizevolumn(packagesize);
			let volumn2=this.calculatesizevolumn(size);
			let volumn=volumn1>0? volumn1:volumn2;
			sprice=volumn*this.express.curexpress.sizeprice;
			wprice=weight*this.express.curexpress.weightprice;
			let html='计重：<span class="text-danger">￥'+wprice+'</span>&nbsp;计体积：<span class="text-danger">￥'+sprice+'</span>&nbsp;<span class="tb-label">大约需'+this.express.curexpress.sendtime+'日</span>';
			return html;
		},
		express_address:function(){
            let province=this.express.province&&this.express.provinceList[this.express.province]? this.express.provinceList[this.express.province].name:'';
            let city=this.express.city&&this.express.cityList[this.express.province]? this.express.cityList[this.express.province][this.express.city].name:'';
            city=(city=='市辖区'||city=='县')? '':city;
            let district=this.express.district&&this.express.districtList[this.express.city]? this.express.districtList[this.express.city][this.express.district].name:'';
            return province? province+city+district:'请点击选择地址';
		},
    },
    watch:{
		
	},
    methods: {
        fetchExpress(){
			let promise=this.$http.get(API.area);
			return promise.then((data)=>{
                
				const result = data.data;
				let provinceList={},cityList={},districtList={};
				this.express.info=result;
                //pv.sohu.com/cityjson
                
				if(returnCitySN){
					let curcode=returnCitySN.cid;
					this.express.showCity=true;
					if(!(curcode % 1e4)){
						this.express.province=curcode;
					}else if(!(curcode % 100)){
						this.express.city=curcode;
						this.express.province=result[curcode].pcode;
						this.express.showDistrict=true;
						this.express.tabIndex=1;
					}else{
						this.express.district=curcode;
						this.express.city=result[curcode].pcode;
						this.express.province=result[this.express.city].pcode;
						this.express.showDistrict=true;
						this.express.tabIndex=2;
					}
				}
				for(let item in result){
					let pcode=result[item].pcode;
					if(!(item % 1e4)){
						//this.$set(this.provinceList, item, result[item]);
						provinceList[item]=result[item];
					}else if(!(item % 100)){
						if(!cityList[pcode])
							cityList[pcode]={};
                    	Object.assign(result[item],{code:item});
                    	cityList[pcode][item]=result[item];
                	}else {
                    	if(!districtList[pcode])
                      		districtList[pcode]={};
                    	Object.assign(result[item],{code:item});
                    	districtList[pcode][item]=result[item];
                	}
                }
                
            	this.express.provinceList=provinceList;
            	this.express.cityList=cityList;
                this.express.districtList=districtList;
                
			}).catch(error => {
			  // Here we could override the busy state, setting isBusy to false
			  // this.isBusy = false
			  // Returning an empty array, allows table to correctly handle busy state in case of error
			  swal_error(error)
			})
        },
        provinceSelected: function(code) {
			this.express.province=code;
			
			// 清除市级和区级选项
			this.express.city = 0;
			this.express.district = 0;

			if(this.express.cityList[code]){
				this.express.tabIndex=1;
				// 选项页面的切换
				this.express.showCity = true;
				this.express.showDistrict = false;
			}else{
				this.express.tabIndex=0;
				this.express.showCity = false;
				this.express.showDistrict = false;
			}
        },
        citySelected: function(code) {
			this.express.city=code;
			this.express.district=0;
			if(this.express.districtList[code]){
				this.express.tabIndex=2;
				this.express.showDistrict = true;
			}else{
				this.express.tabIndex=1;
				this.express.showDistrict = false;
			}
        },
        districtSelected: function(code) {
			this.express.district=code;
		},
        clear:function(){
			this.express.cityList={};
			this.express.districtList={};
			this.express.province=0;
			this.express.city=0;
			this.express.district=0;
			this.express.tabIndex=0;
			this.express.showCity=false;
			this.express.showDistrict=false;
		},
		ok:function(){
			this.express.show=false;
			//todo计算
			let curcode=this.express.district? this.express.district:(this.express.city? this.express.city:this.express.province);
			let flag=false;
			let curexpress={};
			if(this.express.info[curcode].express){
				let express=this.express.info[curcode].express;
				if(express[this.express.selected]){
					curexpress=express[this.express.selected];
					flag=true;
				}
			}
			this.express.curexpress=Object.assign(this.express.curexpress,curexpress,{flag});
		},
        calculatesizevolumn:function(calsize){
			if(!calsize)
				return 0;
			let volumn=0;
			let re=/[^\d]*(\d+)[^\d]*(\d+)[^\d]*(\d+)/g;
			let arr=re.exec(calsize);
			if(arr&&arr.length>1){
				volumn=1
				for(let i=1;i<arr.length;i++){
					volumn*=arr[i]
				}
				volumn=volumn/1e9
			}
			return volumn;
		},
    }
}