const action = function(){

}
action.prototype={
	init:function(){
		console.log('hello Daji');
	}
}
const daji = new action();

module.exports = daji.init();
