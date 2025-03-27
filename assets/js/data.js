// 获取当前时间并格式化
function updateDateTime() {
    const dateElement = document.getElementById('current-date');
    const now = new Date();
  
    // 定义日期和时间格式
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true // 使用 12 小时制（可选）
    };
  
    // 生成格式化的字符串（例如："June 10, 2024 at 03:45:30 PM"）
    const formattedDate = now.toLocaleDateString('en-US', options);
    
    // 更新到页面
    dateElement.textContent = formattedDate;
  }
  
  // 页面加载时立即执行一次
  updateDateTime();
  
  // 每秒更新一次时间（可选）
  setInterval(updateDateTime, 1000);