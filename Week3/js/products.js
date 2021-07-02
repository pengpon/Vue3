import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.1.2/vue.esm-browser.prod.min.js'
import { config } from '../config.js'

const baseUrl = config.API_BASEURL;
const path = 'shan';
let productModal;
let delProductModal;

createApp({
  data() {
    return {
      products: [],       
      isNew: true,        
      isLoading: false,   
      modalTitle: '',
      tmpProduct: {},

    }
  },
  mounted() {
    // 檢查 cookie, 有 token代表已登入
    const token = this.getCookieByName('vue3Token');
    if (token === '') {
      window.location = '/login.html';
    }
    axios.interceptors.request.use(function (config) {
      config.headers.Authorization = token
      return config
    });
    this.getProduct();

    // Create a modal with a single line of JavaScript
    productModal = new bootstrap.Modal(document.getElementById('productModal'), {});
    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {});
  },
  methods: {
    getCookieByName(name) {
      let cookieArray = document.cookie.split(';')
      cookieArray = cookieArray.filter((item) => item.includes(`${name}`))
      return cookieArray.length == 1 ? cookieArray[0].trim().replace(`${name}=`, '') : ''
    },

    // 取得產品列表  預設取第一頁資料
    getProduct(page = 1) {
      const url = `${baseUrl}/api/${path}/admin/products?page=${page}`;
      axios
        .get(url)
        .then((res) => {
          if (res.data.success) {
            this.products = res.data.products;
          } else {
            console.log('無法取得商品');
          }
        })
        .catch(error => {
          console.log(error);
        })
    },

    // 新增產品
    addProduct() {
      productModal.hide();
      this.isLoading = !this.isLoading;
      const url = `${baseUrl}/api/${path}/admin/product`;
      axios.post(url, { data: this.tmpProduct })
        .then((res) => {
          if (res.data.success) {
            this.getProduct();
            this.isLoading = !this.isLoading;
          } else {
            console.log(res.data);
          } 
        })
        .catch(error => {
          console.log(error);
        });
    },

    // 編輯修改產品
    editProduct() {
      productModal.hide();
      this.isLoading = !this.isLoading;
      let id = this.tmpProduct.id;
      const url = `${baseUrl}/api/${path}/admin/product/${id}`;
      axios.put(url, { data: this.tmpProduct })
        .then((res) => {
          if (res.data.success) {
            this.getProduct();
            this.isLoading = !this.isLoading;
          }
        }).catch(error => {
          console.log(error);
        });

    },

    // 刪除產品
    delProduct() {
      delProductModal.hide();
      this.isLoading = !this.isLoading;
        let id = this.tmpProduct.id;
        const url = `${baseUrl}/api/${path}/admin/product/${id}`;
        axios.delete(url, { data: this.tmpProduct })
          .then((res) => {
            if (res.data.success) {
              this.getProduct();
              this.isLoading = !this.isLoading;
            }
          }).catch(error => {
            console.log(error);
          });
    },
    
    // 開啟產品 Modal 新增 / 編輯
    openModal(type, product = {}) {
      console.log(type);
      if (type === 'create') {
        this.modalTitle = '新增產品'; 
      } else {
        this.isNew = false;
        this.modalTitle = '編輯產品';
        this.tmpProduct = { ... product };
      }
      productModal.show();
    },

    // 開啟確認刪除 Modal
    deleteModal(product) {
      this.tmpProduct = { ... product };
      delProductModal.show();
    },

    // 登出
    logout() {
      const url = `${baseUrl}/logout`;
      axios.post(url)
        .then((res) => {
          if (res.data.success) {
            window.location = './login.html';
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
}).mount('#app')

