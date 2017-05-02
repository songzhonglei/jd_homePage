//专门获取任意元素距页面顶部的距离
function getElemTop(elem){
  var top=0;
  while(elem!=null){
    top+=elem.offsetTop;
    elem=elem.offsetParent;
  }
  return top;
}
var floor={
  FHEIGHT:0,//每层楼的高度
  UPLINE:0,//亮灯区域的上限
  DOWNLINE:0,//亮灯区域的下限

  distance:0,//滚动的总距离
  DURATION:500,//滚动的总时间
  STEPS:50,//滚动的总步数
  interval:0,//每步之间的时间间隔
  step:0,//每步的步长
  moved:0,//已经移动的步数

  timer:null,//当前正在滚动动画的需要

  init:function(){//初始化数据，绑定事件处理函数
    this.interval=this.DURATION/this.STEPS;

    //获得id为f1的div的height，去单位，保存在FHEIGHT中
    this.FHEIGHT=
      parseFloat(getComputedStyle($("#f1")).height);
    //计算UPLINE:(innerHeight-FHEIGHT)/2
    this.UPLINE=(window.innerHeight-this.FHEIGHT)/2;
    //计算DOWNLINE:(innerHeight+FHEIGHT)/2
    this.DOWNLINE=(window.innerHeight+this.FHEIGHT)/2;
    
    //为window绑定滚动事件，为checkLight，提前绑定this
    window.addEventListener(
      "scroll",this.checkLight.bind(this));
    //获取id为elevator下的ul下的所有li，保存在lis中
    var lis=$("#elevator>ul>li");
    for(var i=0;i<lis.length;i++){//遍历lis中每个li
      //为当前li绑定鼠标进入事件:
      lis[i].addEventListener("mouseover",
        function(){//this->li
          //获取当前li下第一个子元素，设置其隐藏
          this.firstElementChild.style.display="none";
          //获取当前li下最后一个子元素，设置其显示
          this.lastElementChild.style.display="block";
        }
      );
      var me=this;//留住this
      //为当前li绑定鼠标移出事件
      lis[i].addEventListener("mouseout",
        function(){//this->li me->floor对象
          //获取当前li下第一个子元素，设置其显示
          this.firstElementChild.style.display="block";
          //获取当前li下最后一个子元素，设置其隐藏
          this.lastElementChild.style.display="none";
          //重新检查spans和lis的亮灯状态
          me.checkLight();
        }
      );
    }
    //为id为elevator下的ul绑定单击事件为move，提前绑定this
    $("#elevator>ul").addEventListener(
      "click",this.move.bind(this));
  },
  move:function(e){//负责滚动网页到指定楼层
    clearTimeout(this.timer);
    this.timer=null;
    this.moved=0
    
    var target=e.target;//获得target
    //如果target是a，且class为etitle
    if(target.nodeName=="A"
      &&target.className=="etitle"){
     //获取target前一个兄弟元素的内容，转为整数，存在n中
      var n=
       parseInt(target.previousElementSibling.innerHTML);
      //查找id为f+n的div下的header下的span，保存在span中
      var span=$("#f"+n+">header>span");
      //计算span距页面顶部的总距离top
      var top=getElemTop(span);
      //计算scrollTop为top-UPLINE
      var scrollTop=top-this.UPLINE;
      //获得当前页面的滚动高度:
      var currScrollTop=
        document.documentElement.scrollTop
        ||document.body.scrollTop;
      //计算distance: scrollTop-currScrollTop
      this.distance=scrollTop-currScrollTop;
      this.step=this.distance/this.STEPS;//计算step
      //启动滚动动画
      this.timer=setTimeout(
        this.moveStep.bind(this),this.interval);
    }
  },
  moveStep:function(){//让页面滚动一步
    scrollBy(0,this.step);
    this.moved++;
    if(this.moved<this.STEPS){
      this.timer=setTimeout(
        this.moveStep.bind(this),this.interval);
    }else{
      this.timer=null;
      this.moved=0;
    }
  },
  //检查并修改每个楼层的span的亮灯状态
  checkLight:function(){
    //获得scrollTop
    var scrollTop=document.documentElement.scrollTop
                ||document.body.scrollTop;
    //获得所有class为floor下的header元素下的子代元素span，保存在spans中
    var spans=$("div.floor>header>span");
    //获取id为elevator下的ul下的所有li，保存在lis中
    var lis=$("#elevator>ul>li");
    for(var i=0;i<spans.length;i++){//遍历spans中每个span
      //获得当前span元素距页面顶部的总top，保存在top中
      var top=getElemTop(spans[i]);
      //如果top-scrollTop>UPLINE&&top-scrollTop<DOWNLINE
      if(top-scrollTop>this.UPLINE
          &&top-scrollTop<this.DOWNLINE){
        //设置当前span的class为hover
        spans[i].className="hover";
        //将lis中当前li下第一个子元素隐藏
        lis[i].firstElementChild.style.display="none";
        //将lis中当前li下最后一个子元素显示
        lis[i].lastElementChild.style.display="block";
      }else{//否则，清除当前span的class
        spans[i].className="";
        //将lis中当前li下第一个子元素显示
        lis[i].firstElementChild.style.display="block";
        //将lis中当前li下最后一个子元素隐藏
        lis[i].lastElementChild.style.display="none";
      }
    }
    //获取class为floor下的header元素下的子代元素span中class为hover的，保存在hoverSpan中
    var hoverSpan=$("div.floor>header>span.hover");
    //如果hoverSpan不等于null，就修改id为elevator的div显示出来，否则隐藏
    $("#elevator").style.display=
      hoverSpan!=null?"block":"none";
  },
  
}
window.addEventListener("load",function(){floor.init()});