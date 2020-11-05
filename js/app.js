(function (window) {
	'use strict';
	 //里面的变量都是局部变量,除非绑定在window上
	 //书写本地存储的存取方法
	 window.storage={
		 getStorage(){
			 //获取本地存储,并转换成json对象
            return JSON.parse(window.localStorage.getItem('todos')||'[]')
		 },
		 setStorage(json){
			 //把传入的json对象转成json字符串,存入本地存储
			 window.localStorage.setItem('todos',JSON.stringify(json));
		 }
	 }
	 //创建一个Vue实例
	 window.app=new Vue({
		el:".todoapp",
		data:{
			tasks:window.storage.getStorage(),
			newTask:"",
			isEditing:-1,
			status:true,
			count:0,
			flag:"",//如果flag==""，表示路由在#/，就是全部显示
		},
		computed:{
             activeNum(){
			  this.count=0,
			  this.tasks.forEach((task)=>{
				  if(!task.completed){
					  this.count++;
				  }
			  })
			  return this.count;
			 },
			 isShow(){
				for(var i=0;i<this.tasks.length;i++){
					if(this.tasks[i].completed){
						return true
					}
				}	
				return false;
			 }
		},
		methods:{
			show(i){
				if(this.flag===""){
					return true;
				}else if(this.flag.completed===i){
					return true;
				}
				window.storage.setStorage(this.tasks);
			},

			clearAll(){
				this.tasks=this.tasks.filter(task=>!task.completed)
			},
			toggleAll(){
				this.tasks.forEach((task)=>{
					task.completed=this.status
				});
				this.status=!this.status;
				//同步到本地存储中				
				window.storage.setStorage(this.tasks);
				
			},
			remove(id){
				this.tasks=this.tasks.filter(task=>{
				   return task.id!=id
			   }) 
			   //同步到本地存储中			
			   window.storage.setStorage(this.tasks);
			},
			add(){
				var task={
					title:this.newTask,
					compeleted:false,
					id:Date.now()
				}
				this.tasks.push(task);
				//输入完成后，清空文本框
				this.newTask="",
				//同步到本地存储中				
				window.storage.setStorage(this.tasks);
			}
		}
	})
	//监控路由的变化
	window.onhashchange=function(){
		console.log(location.hash);
		//专门在vue实例里面声明一个变量由于标识当前是在哪个路由
		if(location.hash=="#/"){
			window.app.flag="";
			return;
		}else if(location.hash=="#/active"){
			window.app.flag={completed:false};//active就是要显示未完成任务，flag最好有意义
		}else if(location.hash=="#/completed"){
			window.app.flag={completed:true};//completed就是要显示未完成任务，flag最好有意义
		}else{
			//如果是其他路由都显示全部任务
			window.app.flag="";
			return;
		}
	}
	
})(window);
