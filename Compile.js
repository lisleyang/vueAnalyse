//node 元素节点 	vm ：vue实例
// 返回编译好的html
function Compile(node,vm){
	if(node){
		this.$frag = this.nodeToFragment(node,vm);
		return this.$frag;
	}
}

Compile.prototype = {
	nodeToFragment : function(node,vm){
		var self = this;
		var frag = document.createDocumentFragment();
		var child;

		// 遍历所有节点，给每个节点/每个属性 都加上双向数据绑定
		while(child = node.firstChild){
			self.compileElement(child,vm);
			frag.append(child);
		}

		return frag;
	},
	compileElement : function(node,vm){
		var reg = /\{\{(.*)\}\}/;

		//指定类型为元素
		if(node.nodeType === 1){
			var attr = node.attributes;
			//解析属性
			for(var i=0;i<attr.length;i++){
				if(attr[i].nodeName == "v-model"){
					var name = attr[i].nodeValue; //获取v-model绑定的属性名
					node.addEventListener('input',function(e){
						//给相应的data属性赋值，进而触发该属性的set方法
						vm[name] = e.target.value;
					})

					// 给每个跟vue有关的属性都加上双向数据绑定
					new Watcher(vm,node,name,'value');
				}
			}
		}
		// 节点类型为text
		if(node.nodeType == 3){
			if(reg.test(node.nodeValue)){
				var name = RegExp.$1;
				name = name.trim();
				//给每个跟vue有关的文本（{{}}）都加上双向数据绑定
				new Watcher(vm,node,name,'nodeValue');

			}
		}
	}
}