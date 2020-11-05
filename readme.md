## TodoMVC
###  一 项目结构
+css
 +app.css:我们的css就写在这里（如果不写css可以删除该文件和引用）
+js
 +app.js:我们的代码就写在这里
+ .editorconfig:对编辑器的一些配置
+ .gitattributes:对git的设置
+ .gitignore:git的忽略文件配置
+ package.json:项目描述
  + 使用npm install 下载项目依赖包
  + 下载完成多了一个node_module文件夹
+ index.html:html文件

#### 二 项目功能描述
+ 展示任务 
+ 添加任务
+ 删除任务
+ 编辑任务
+ 切换任务完成状态
+ 批量切换完成任务状态
+ 清除已完成任务数量
+ 隐藏/显示清除按钮
+ 显示未完成任务数量
+ 切换不同任务的显示
  +点击按钮
  +改变路线
+ 数据同步到本地存储中

### 三 功能思路
+ 选择使用vue来完成这个项目:引入vue,在引入app.js之前
+ 展示任务容器:ul.todo-list>li
+ 添加任务:input.new-todo里面enter触发
+ 删除任务:button.destroy点击触发
+ 编辑任务:div.view>label双击触发
+ 切换任务完成状态:input.toggle点击触发
+ 批量切换完成任务状态:label.toggle-all点击触发
+ 清除已完成任务数量:button.clear-completed点击触发
+ 隐藏/显示清除按钮:通过v-f实时控制button.clear-completed的显示和隐藏
+ 显示未完成任务数量:.todo-count>string通过v-text实时设置数量
+ 切换不同任务的显示:通过监控路由切换不同任务
+ 数据同步到本地存储中:书写两个方法,一个存储入本地存储,一个从本地存储中取出

### 四 书写本地存储的存取方法(app.js)
> 存储的任务集合是一个数组,每个任务是一个对象,任务对象的格式如下:
```js
        {
			 title:"任务名称",
			 completed:true/false,
			 id:"当前时间戳"
		 }
```
>定义一个storage对象,里面放本地存取方法
```js
window.storage={
		 getSorage(){
			 //获取本地存储,并转换成json对象
            return JSON.parse(window.localStorage.getItem('todos')||'[]')
		 },
		 setStorage(json){
			 //把传入的json对象转成json字符串,存入本地存储
			 window.localStorage.setItem('todos',JSON.stringify(json));
		 }
	 }
```
### 五 展示任务
```html
<ul class="todo-list">
<ul class="todo-list">
 <!-- 下面就是展示任务列表的li -->
	<!-- 如果某一项是编辑状态，可以添加editing类名，如果是已完成，可以添加completed类名 -->
	<li v-for="task in tasks" :class="{completed:task.completed}" >
	<div class="view">
	<input class="toggle" type="checkbox" checked>
	<label>{{task.title}}t</label>
	<button class="destroy"></button>
    </div>
	<input class="edit" value="Create a TodoMVC template">
	</li>
					
	</ul>					
```
```js
 window.app=new Vue({
  el:"todoapp",
  data:{
	tasks:window.storage.getStorage()
	}
	})
```

### 六 添加任务
```html
<input class="new-todo" placeholder="What needs to be done?" 
autofocus
v-model="newTask" 
@keyup.enter="add"
```
```js
data:{
	tasks:window.storage.getStorage(),
   newTask:""
},
methods:{
	add(){
		var task={
			title:this.newTask,
			compeleted:false,
			id:Date.now()
			}
			this.task.push(task);
			//输入完成后，清空文本框
			this.newTask="",
			//同步到本地存储中
			
			window.storage.setStorage(this.tasks)
		}
	}
```
###七 编辑任务
```js
data:{
	isEditing:-1
}
```
```html
<li v-for="task in tasks" :class="{completed:task.completed,editing:isEditing==task.id}" >
		<div class="view">
		<input class="toggle" type="checkbox" checked>
		<label
		    @dblclick="isEditing=task.id"
								
			>{{task.title}}</label>
			<button class="destroy"></button>
			</div>
			<input class="edit" v-model="task.title"
			 @keyup.enter="isEditing=-1" 
			  @blur="isEditing=-1"
			>
		</li>
```

### 八 删除任务
```html
<button class="destroy" @click="remove(task.id)"></button>
```
```js
//在methods里面添加一个remove方法
remove(id){
	this.tasks=this.tasks.filter(task=>{
   return task.id!=id
 }) 
   window.storage.setStorage(this.tasks);
},
```
### 九 切换任务完成状态
```html
<input class="toggle" type="checkbox" v-model="task.completed">
```
### 十 批量切换任务状态
```js
//在data里面添加一个status方法
status:true
//在methods里面添加一个toggleAll方法
toggleAll(){
	this.tasks.forEach((task)=>{
	task.compeleted=this.status
	});
	this.status=!this.status;
	//同步到本地存储中				
	window.storage.setStorage(this.tasks);
},
```
```html
<label for="toggle-all" @click="toggleAll">Mark all as complete</label>
```
### 十一  显示未完成任务数量
```html
<span class="todo-count"><strong v-text="activeNum"></strong> item left</span>
```
```js
data:{
	count:0
}
computed:{
	activeNum(){
	this.count=0,
	this.tasks.forEach((task)=>{
	if(!task.completed){
	  this.count++;
	 }
  })
  return this.count;
	 }
},
```
### 12 清除已完成任务
```html
<button class="clear-completed" @click="clearAll">Clear completed</button>
```
```js
clearAll(){
this.tasks=this.tasks.filter(task=>!task.completed)
	},
```
### 13 隐藏/显示清除按钮
```html
				<button class="clear-completed" @click="clearAll" v-if="isShow">Clear completed</button>

```
```js
isShow(){
	for(var i=0;i<this.tasks.length;i++){
	if(this.tasks[i].completed){
	return true
	 }	
	}	
	return false;
	}
```

###14 切换不同任务的显示
>点击all/active/complete可以切换不同任务的显示
>在浏览器地址栏输入：#/或者#/active或者#/completed可以切换不同任务的显示
>是做点击事件还是监控路由
>只要监控了路由，a标签点击会自动切换路由，就也能切换不同任务的显示
>监控路由的事件：window.onhashchange=function(){}

>切换按钮的高亮状态
```html
<ul class="filters">
     <li>
		<a :class="{selected:flag===''}" href="#/">All</a>
	    </li>
		<li>
		<a :class="{selected:flag.completed===false}"  href="#/active">Active</a>
		</li>
	    <li>
		<a :class="{selected:flag.completed===true}" href="#/completed">Completed</a>
	</li>
</ul>
```
```js
data:{
	flag:""
}

//vue实例外面添加hash变化监听
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
	
```
>切换对应的任务显示
```html
	<li v-for="task in tasks" :class="{completed:task.completed,editing:isEditing==task.id}" v-if="show(task.completed)">

```
```js
show(i){
		if(this.flag===""){
		return true;
	}else if(this.flag.completed===i){
					return true;
	}
	window.storage.setStorage(this.tasks);
},
```
