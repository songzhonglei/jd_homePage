/*封装$*/
window.$=HTMLElement.prototype.$=function(selector){
    var elems=(this==window?document:this)
        .querySelectorAll(selector);
    return elems.length==0?null:elems.length==1?elems[0]:elems;
}
/*广告图片数组*/
var imgs=[
  {"i":0,"img":"images/index/banner_01.jpg"},
  {"i":1,"img":"images/index/banner_02.jpg"},
  {"i":2,"img":"images/index/banner_03.jpg"},
  {"i":3,"img":"images/index/banner_04.jpg"},
  {"i":4,"img":"images/index/banner_05.jpg"},  
];
var adv={
  WIDTH:0,//保存每张图片的宽度

  distance:0,//保存本次轮播的总距离
  DURA:500,//保存一次轮播的总时间
  STEPS:100,//保存一次轮播的总步数
  interval:0,//保存每一步移动的时间间隔
  step:0,//保存每一步移动的步长
  timer:null,//保存当前正在播放的动画序号
  moved:0,//保存本次轮播已经移动的步数，moved==STEPS，说明移动完成

  WAIT:5000,//保存自动轮播之间的等待时间

  canAuto:true,//标识能否自动轮播

  init:function(){//根据imgs数组内容向imgs和indexs中添加li
    //获得id为slider的div的宽度，去单位，保存在WIDTH中
    this.WIDTH=parseFloat(getComputedStyle($("#slider")).width);
    this.updateView();//更新页面
    this.interval=this.DURA/this.STEPS; //计算interval: DURA/STEPS
    //为id为indexs的ul绑定鼠标进入事件为:
    var me=this;//留住this
    $("#indexs").addEventListener("mouseover",function(e){
        var target=e.target;//获得目标元素target
        //如果target是li且class不是hover
        if(target.nodeName=="LI"&&target.className!="hover"){
          //获得id为indexs下class为hover的li的内容，保存在before 
          var before=$("#indexs>.hover").innerHTML;
          //启动滚动动画，传入target的内容-before作为参数
          me.move(target.innerHTML-before);
        }
    });
    //为id为slider的div绑定鼠标进入事件
    $("#slider").addEventListener("mouseover",function(){
      me.canAuto=false;
    });
    $("#slider").addEventListener("mouseout",function(){
      me.canAuto=true;
    });
    this.autoMove();//启动自动轮播0
  },
  autoMove:function(){//启动自动轮播
    var me=this;//留住this
    this.timer=setTimeout(function(){
      if(me.canAuto){
        me.move(1);
      }else{
        me.autoMove();
      }
    },this.WAIT);
  },
  move:function(n){//启动一次滚动动画
    //停止另一个动画，防止叠加
    clearTimeout(this.timer);
    this.timer=null;
    $("#imgs").style.left="";//清除id为imgs的ul的left
    this.distance=n*this.WIDTH;//计算本次轮播的总距离: n*WIDTH
    this.step=this.distance/this.STEPS;//计算每步的步长
    if(n<0){//如果右移:
      //删除imgs结尾的-n个元素，拼接到imgs开头
      imgs=imgs.splice(imgs.length+n,-n).concat(imgs);
      this.updateView();//更新页面
      //设置id为imgs的ul的left为n*WIDTH
      $("#imgs").style.left=n*this.WIDTH+"px";
    }
    //启动一次性定时器，设置任务为moveStep，并且提前绑定this，设置时间间隔为interval
    this.timer=
      setTimeout(this.moveStep.bind(this,n),this.interval);
  },
  moveStep:function(n){//滚动一步
    //获得id为imgs的ul的left,去单位，保存在left中
    var left=parseFloat(getComputedStyle($("#imgs")).left);
    left-=this.step;//left-step
    $("#imgs").style.left=left+"px";//设置id为imgs的ul的left为left
    this.moved++;//moved+1
    if(this.moved<this.STEPS){//如果moved<STEPS
      //再次启动一次性定时器，设置任务为当前函数，并且提前绑定this，设置时间间隔为interval
      this.timer=
        setTimeout(arguments.callee.bind(this,n),this.interval);
    }else{//否则(本次滚动结束)
      this.timer=null;
      this.moved=0;//moved归0 
      $("#imgs").style.left="";//清除id为imgs的ul的left
      if(n>0){//如果n>0，说明是左移
        //删除数组开头n个元素，追加到数组末尾
        imgs=imgs.concat(imgs.splice(0,n))
        this.updateView();//更新页面
      }
      this.autoMove();//立刻调用自动轮播
    }
  },
  updateView:function(){//在每次滚动时，根据数组的内容更新两个ul
    //清除id为imgs和indexs的内容
    $("#imgs").innerHTML=$("#indexs").innerHTML="";
    //创建文档片段imgsfrag
    var imgsfrag=document.createDocumentFragment();
    //创建文档片段idxsfrag
    var idxsfrag=document.createDocumentFragment();
    for(var i=0;i<imgs.length;i++){//遍历imgs数组中每张图片
      //创建li元素，保存在liImg中
      var liImg=document.createElement("li");
      var img=new Image();//新建一个Image元素，保存在img中
      img.src=imgs[i].img;//设置img的src为当前图片的img属性
      liImg.appendChild(img);//将img临时追加到liImg中
      imgsfrag.appendChild(liImg);//将liImg追加到imgsfrag中
      //创建li元素，保存在liIdx中
      var liIdx=document.createElement("li");
      liIdx.innerHTML=i+1;//设置liIdx的内容为i+1
      idxsfrag.appendChild(liIdx);//将liIdx临时追加到idxsfrag中
    }//(遍历结束)
    //将imgsfrag追加到id为imgs的ul下
    $("#imgs").appendChild(imgsfrag);
    //将idxsfrag追加到id为indexs的ul下
    $("#indexs").appendChild(idxsfrag);
    //设置id为imgs的ul的宽度为imgs数组的元素个数*WIDTH
    $("#imgs").style.width=this.WIDTH*imgs.length+"px";
    //找到id为indexs下所有li，设置和imgs中第一个元素的i属性对应位置的li的class为hover
    $("#indexs>li")[imgs[0].i].className="hover";
  },
};
window.addEventListener("load",function(){adv.init()});