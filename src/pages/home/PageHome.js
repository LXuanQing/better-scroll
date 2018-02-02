import { Component } from 'react';
import BScroll from 'better-scroll'
import classnames from 'classnames'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import TransitionGroup from 'react-transition-group/TransitionGroup'
import './PageHome.less';
import Shopcar from 'components/shopcar'
let style_index = 0
export default class PageHome extends Component {

	constructor(props) {
		super(props)
		this.state = {
			lineHeight : [],
			currentIndex: 0,
			foodCount: 0,
			showJian: false,
			ballShow: false, // 定义五个小球
			ballTranslateY: null,
			innerTransX: null,
			list: [1],
			showReactCss: false,
			clickADD: false,
			ball:[{show: false}],
			hasShowBall: []
		}
	}

	componentDidMount() {
		let t = this
		this.scrollY // 右侧food滚动高度
		// this.currentIndex = 0 // 右侧滚动，左侧索引active
		this.menuScroll = new BScroll(t.menu_wrapper, {
			click: true // touch事件会默认preventDefault，pc端可能会触发两个事件，pc的事件没有阻止，又会派发一个事件
		}) // 注意正式场景下，数据的异步问题，需要等dom挂上后再实例化
		this.foodScroll = new BScroll(t.food_wrapper, {
			probeType: 3, // 探针，告诉实时滚动的位置
			click: true
		})
		
		this.listHeight = [] // 保存每一个foodList的高度
		setTimeout(() => {
			this.calculateHeight()
		},10)
		
		this.foodScroll.on('scroll',(pos) => {
			// 清楚style,flag置0
			style_index = 0
			let style_add = document.getElementById("abc")
			const headEl = document.getElementsByTagName('head')[0];
			
			style_add ? headEl.removeChild(style_add) : ""

			this.scrollY = 	Math.abs(Math.round(pos.y)) // 滚动距离是小数，而且是负值
			for(let i = 0;i<this.listHeight.length;i++) {
				let height1 = this.listHeight[i]
				// let height2 = this.listHeight[i+1]
				// if(!height2 || (this.scrollY > height1 && this.scrollY < height2)) {
				// 	// this.currentIndex = i
				// 	this.setState({
				// 		currentIndex: i
				// 	})
				// }
				
				if(this.scrollY - height1 < 0) {
					this.setState({
						currentIndex: i-1 == -1 ? 0 : i-1
					})
					break;
				}
			}
		})
	}

	// 计算右侧每个区域的高度
	calculateHeight() {
		let foodList = this.food_wrapper.getElementsByClassName("food-list-hook") // 每一个的高度包括标题和内容
		let height = 0 // 第一个的
		this.listHeight.push(height)
		for(let i =0;i<foodList.length; i++) {
			let item = foodList[i]
			height += item.clientHeight
			this.listHeight.push(height)
		}
	}	

	menuClick(index,e) {
		// if(!e._constructed) { // 阻止浏览器原生事件
		// 	return
		// }
		let foodList = this.food_wrapper.getElementsByClassName("food-list-hook")
		let el = foodList[index] // 应该滚动到的元素
		this.foodScroll.scrollToElement(el,300)
	}
	// 加入购物车
	addCar(e) {

		let el = e.target
		let pos = el.getBoundingClientRect()
		let x = pos.left - 30 // 减去加号的大小
		let y = -(window.innerHeight - pos.top - 30)
		let arr = this.state.list
		let doc = document
		let el_style = doc.createElement('style');
		el_style.setAttribute('type', 'text/css');
		el_style.id = "abc"
	
		const headEl = doc.getElementsByTagName('head')[0];
		let rule = `
			.example-enter{transform: translate3d(0,${y}px,0);}
			.example-enter .inner {
				transform: translate3d(${x}px,0,0);
			}
			.example-enter.example-enter-active {
				transform: translate3d(0,0,0);
				transition: all .4s cubic-bezier(0.49,-0.29,0.75,0.41);
			}
			.example-enter.example-enter-active .inner {
				transform: translate3d(0,0,0);
				transition: all .4s linear;
			}
		`
		if(style_index == 0) {
			el_style.appendChild(doc.createTextNode(rule))
			headEl.appendChild(el_style);
		} 
		style_index++
		
		for(let i=0;i<this.state.ball.length;i++) {
			let item = this.state.ball[i]
			if(!item.show) {
				let show_ball = this.state.hasShowBall
				show_ball.push(item)
				this.setState({
					hasShowBall: show_ball
				})
			}
		}
		
		this.setState({
			clickADD: true
		},() => {
			// 获取小球
			let ele_ball = document.getElementsByClassName("ball")
			
			for(let i =0;i<ele_ball.length;i++) {
				ele_ball[i].addEventListener("transitionend",(e) => {
					e.target.parentNode ? e.target.parentNode.removeChild(e.target): ""
					
				})
			}
			// console.log(ele_ball,"ele_ball")
			// ele_ball.addEventListener("transitionend",(e) => { // 函数会执行两次
			// 	// this.setState({
			// 	// 	clickADD: false
			// 	// })
			// 	console.log(e.target)
			// 	console.log("ee")
			// 	let i = 0;
			// 	if(i == 0) {
			// 	}
			// 	i++
			// 	// let parrent = document.getElementsByClassName("ball-container")[0]
			// 	// parrent.removeChild(ele_ball)
			// 	// document.body.removeChild(ele_ball)
			// },false)
		})
	}

	jian() {
		let doc = document
		let el_style = doc.createElement('style');
		el_style.setAttribute('type', 'text/css');
		const headEl = doc.getElementsByTagName('head')[0];
		let rule = `
			.example-leave{opacity: 1;}
			.example-leave-active { 
				opacity: 0;
				transition: opacity 500ms ease-in;
			}
		`
		el_style.appendChild(doc.createTextNode(rule))
		headEl.appendChild(el_style);

		this.setState({
			foodCount: this.state.foodCount -= 1,
			clickADD: false
		},() => {
			if(this.state.foodCount === 0) {
				setTimeout(() => {
					this.setState({
						showJian: false
					})
				},500)
			}
		})
	}

	addBar(key) {
		return (
			<div key={key} className={classnames("ball")}>
				<div className={classnames("inner")}></div>
			</div>
		)
	}

  	render() {
		const t = this;
		
		return (
			<div className="goods">
				<div ref={(v) => this.menu_wrapper = v} className="menu_wrapper">
					<ul className="menu">
						<li onClick={this.menuClick.bind(this,0)} className={classnames("menu_item",{"active": this.state.currentIndex == 0})} >
							<span className="text">1</span>
						</li>
						<li onClick={this.menuClick.bind(this,1)} className={classnames("menu_item",{"active": this.state.currentIndex == 1})}>
							<span className="text">2</span>
						</li>
						<li onClick={this.menuClick.bind(this,2)} className={classnames("menu_item",{"active": this.state.currentIndex == 2})}>
							<span className="text">3</span>
						</li>
						<li onClick={this.menuClick.bind(this,3)} className={classnames("menu_item",{"active": this.state.currentIndex == 3})}>
							<span className="text">4</span>
						</li>
						<li onClick={this.menuClick.bind(this,4)} className={classnames("menu_item",{"active": this.state.currentIndex == 4})}>
							<span className="text">5</span>
						</li>
						<li onClick={this.menuClick.bind(this,5)} className={classnames("menu_item",{"active": this.state.currentIndex == 5})}>
							<span className="text">6</span>
						</li>
						<li onClick={this.menuClick.bind(this,6)} className={classnames("menu_item",{"active": this.state.currentIndex == 6})}>
							<span className="text">7</span>
						</li>
						<li onClick={this.menuClick.bind(this,7)} className={classnames("menu_item",{"active": this.state.currentIndex == 7})}>
							<span className="text">8</span>
						</li>
						<li onClick={this.menuClick.bind(this,8)} className={classnames("menu_item",{"active": this.state.currentIndex == 8})}>
							<span className="text">9</span>
						</li>
					</ul>
				</div>
				<div ref={(v) => {this.food_wrapper = v}} className="food_wrapper">
					<ul>
						<li className="food_list food-list-hook">
							<h2 className="title">标题1</h2>
							<ul>
								<li className="foods">内容1</li>
								<li className="foods">内容1</li>
								<li className="foods">内容1</li>
								<li className="foods">内容1</li>
								<li className="foods">内容1</li>
								<li className="foods">内容1</li>
								<li className="foods">内容1</li>
								<div className="add-car-content">
									<div onClick={this.jian.bind(this)} className={classnames("jian-content",{out: this.state.foodCount > 0,"showJian": this.state.showJian})}>
										<span className={classnames("jian",{in: this.state.foodCount > 0})}>-</span>
									</div>
									<div className={classnames("count",{show_num: this.state.foodCount > 0})}>{this.state.foodCount}</div>
									<div onClick={this.addCar.bind(this)} className="add">+</div>
								</div>
							</ul>
						</li>
						<li className="food_list food-list-hook">
							<h2 className="title">标题2</h2>
							<ul>
								<li className="foods">内容2</li>
								<li className="foods">内容2</li>
								<li className="foods">内容2</li>
								<li className="foods">内容2</li>
								<li className="foods">内容2</li>
								<li className="foods">内容2</li>
								<li className="foods">内容2</li>
								<div className="add-car-content">
									<div className="jian">-</div>
									<div className="count">2</div>
									<div className="add">+</div>
								</div>
							</ul>
						</li>
						<li className="food_list food-list-hook">
							<h2 className="title">标题3</h2>
							<ul>
								<li className="foods">标题3</li>
								<li className="foods">标题3</li>
								<li className="foods">标题3</li>
								<li className="foods">标题3</li>
								<li className="foods">标题3</li>
								<li className="foods">标题3</li>
								<li className="foods">标题3</li>
								<div className="add-car-content">
									<div className="jian">-</div>
									<div className="count">2</div>
									<div className="add">+</div>
								</div>
							</ul>
						</li>
						<li className="food_list food-list-hook">
							<h2 className="title">标题4</h2>
							<ul>
								<li className="foods">标题4</li>
								<li className="foods">标题4</li>
								<li className="foods">标题4</li>
								<li className="foods">标题4</li>
								<li className="foods">标题4</li>
								<li className="foods">标题4</li>
								<li className="foods">标题4</li>
								<div className="add-car-content">
									<div className="jian">-</div>
									<div className="count">2</div>
									<div className="add">+</div>
								</div>
							</ul>
						</li>
						<li className="food_list food-list-hook">
							<h2 className="title">标题5</h2>
							<ul>
								<li className="foods">标题5</li>
								<li className="foods">标题5</li>
								<li className="foods">标题5</li>
								<li className="foods">标题5</li>
								<li className="foods">标题5</li>
								<li className="foods">标题5</li>
								<li className="foods">标题5</li>
								<div className="add-car-content">
									<div className="jian">-</div>
									<div className="count">2</div>
									<div className="add">+</div>
								</div>
							</ul>
						</li>
						<li className="food_list food-list-hook">
							<h2 className="title">标题6</h2>
							<ul>
								<li className="foods">标题6</li>
								<li className="foods">标题6</li>
								<li className="foods">标题6</li>
								<li className="foods">标题6</li>
								<li className="foods">标题6</li>
								<li className="foods">标题6</li>
								<li className="foods">标题6</li>
								<div className="add-car-content">
									<div className="jian">-</div>
									<div className="count">2</div>
									<div className="add">+</div>
								</div>
							</ul>
						</li>
						<li className="food_list food-list-hook">
							<h2 className="title">标题7</h2>
							<ul>
								<li className="foods">标题7</li>
								<li className="foods">标题7</li>
								<li className="foods">标题7</li>
								<li className="foods">标题7</li>
								<li className="foods">标题7</li>
								<li className="foods">标题7</li>
								<li className="foods">标题7</li>
								<div className="add-car-content">
									<div className="jian">-</div>
									<div className="count">2</div>
									<div className="add">+</div>
								</div>
							</ul>
						</li>
						<li className="food_list food-list-hook">
							<h2 className="title">标题8</h2>
							<ul>
								<li className="foods">标题8</li>
								<li className="foods">标题8</li>
								<li className="foods">标题8</li>
								<li className="foods">标题8</li>
								<li className="foods">标题8</li>
								<li className="foods">标题8</li>
								<li className="foods">标题8</li>
								<div className="add-car-content">
									<div className="jian">-</div>
									<div className="count">2</div>
									<div className="add">+</div>
								</div>
							</ul>
						</li>
						<li className="food_list food-list-hook">
							<h2 className="title">标题9</h2>
							<ul>
								<li className="foods">标题9</li>
								<li className="foods">标题9</li>
								<li className="foods">标题9</li>
								<li className="foods">标题9</li>
								<li className="foods">标题9</li>
								<li className="foods">标题9</li>
								<li className="foods">标题9</li>
								<div className="add-car-content">
									<div className="jian">-</div>
									<div className="count">2</div>
									<div className="add">+</div>
								</div>
							</ul>
						</li>
					</ul>
				</div>
				<div className="shopcar">
					<div className="content">
						<div className="content-left">left</div>
						<div className="content-right">right</div>
					</div>
				</div>
				<ReactCSSTransitionGroup
					component="div"
					className="ball-container"
					transitionName='example'
					style={this.state.ballTranslateY}
					transitionEnter={true}
					transitionLeave={false}
					transitionEnterTimeout={1500}
				>
					{this.state.hasShowBall.map((item,key) => {
						return <div className={classnames("ball")}>
						<div className={classnames("inner")}></div>
					</div>
					})}
 				</ReactCSSTransitionGroup>
				{/* 购物车详情 */}
				{this.state.listShow ? 
					<div className={classnames("shopcar-list")}>
						<div className="list-header">
							<h1 className="title">购物车</h1>
							<span className="empty">清空</span>
						</div>
						<div className="list-content">
							<ul>
								{this.selectFood.map((food,index => {
									return (
										<li className="food">
											<span className="name">{food.name}</span>
											<div className="price">
												<span>{food.price}</span>
											</div>
											<div className="catcontrol-wrapper">
												{/* {引用catcontrol组件} */}
											</div>
										</li>
									)
								}))}
							</ul>
						</div>
					</div> 
				: ""}
			</div>
		);
  	}
}

/**
 * wrapper 最外层定视口的高度，绝对定位 width:100%; top: bottom: overflow: hidden
 * 子元素 左侧 flex: 0 0 80px; width: 80px; 不写width在安卓有问题
 * 右侧 flex: 1;
 *  
 * 单行、两行都垂直居中, display: table;
 * 
 * 
//  * ReactCSSTransitionGroup 是节点插入移除时执行css动画，所以开始不能用dispaly:none先隐藏，再block，必须执行节点插入操作
//  */


