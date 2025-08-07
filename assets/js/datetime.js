// 日期显示功能
function updateDateTime() {
	const dateElements = document.querySelectorAll('.current-date');
	const options = { year: 'numeric', month: 'long', day: 'numeric' };
	dateElements.forEach(element => {
		element.textContent = new Date().toLocaleDateString('en-US', options);
	});
}

// 初始化日期显示
updateDateTime();
setInterval(updateDateTime, 60000); // 每分钟更新一次，减少资源消耗 