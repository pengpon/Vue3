import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.1.2/vue.esm-browser.prod.min.js';
import { config } from '../config.js';

// 建立實體
createApp({
  data() {
    return {
      title: config.DASHBOARD_TITLE,
      user: {
        username: '',
        password: '',
      },
      isDisable: true,
    }

  },
  methods: {
    onChange() {
      this.isDisable = !(this.user.username.length !== 0 && this.user.password.length !== 0);
    },
    login() {
      const api = `${config.API_BASEURL}/admin/signin`;
      
      axios.post(api, this.user)
        .then((response) => {
          // 確認success 為 true
          if (response.data.success) {
            // 存 cookie
            const { token, expired } = response.data;
            let expiredTime = new Date(expired);
            document.cookie = `vue3Token=${token};expired=${expiredTime};path=/`;
            // 成功登入後 導至商品頁
            window.location = './products.html';
          } else {
            alert('請再檢查一次帳號密碼')
          }
        })
        .catch((error) => {
          console.log(error, 'error');
        });
    }
  },
}).mount('#app');

