//参数 ： vm实例  data的key   data的value
function defineReactive(obj,key,val){
	var dep = new Dep();
	// 从data的属性变为vm的属性了
	Object.defineProperty(obj,key,{
		get : function(ele){
			console.log(ele)
			// 添加订阅者watcher到订阅者Dep
			// 只有在Compiler中new Watcher以后才会有Dep.target
			if(Dep.target){	//Dep.target用来确保同一时间只有一个
				// js的浏览器单线程特性，保证这个全局变量在同一时间内，只会有同一个监听器使用
				dep.addSub(Dep.target)
			}
			return val;
		},
		// 当有新值的时候，先改变，然后提醒dep
		set : function(newVal){
			if(newVal == val) return;
			val = newVal;
			// 作为发布者发出通知
			// 属性已经传进来改变了，但是dom还没有变，要通知dom变化
			dep.notify();
		}
	})
}


// mvvm.js中传入 
// obj:data属性的值 vm : Vue的实例
// data :{ text : 'hello World'}
function observe(obj,vm){
	// 遍历data
	Object.keys(obj).forEach(function(key){
		// 对data上的所有的值进行双向数据绑定
		//参数 ： 实例 data的key  data的value
		defineReactive(vm,key,obj[key]);
	})
}