import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.1.2/vue.esm-browser.prod.min.js'
import { config } from '../config.js'

const baseUrl = config.API_BASEURL
const path = 'shan'
let productModal
let delProductModal

const app = createApp({
  data() {
    return {
      products: [],
      isNew: true,
      isLoading: false,
      modalTitle: '',
      tmpProduct: {},
      pagination: {},
    }
  },
  mounted() {
    // 檢查 cookie, 有 token代表已登入
    const token = this.getCookieByName('vue3Token')
    if (token === '') {
      window.location = './login.html'
    }
    axios.interceptors.request.use(function (config) {
      config.headers.Authorization = token
      return config
    })
    this.getProduct()
    // Create a modal with a single line of JavaScript
    productModal = new bootstrap.Modal(document.getElementById('productModal'), {})
    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {})
  },
  methods: {
    getCookieByName(name) {
      let cookieArray = document.cookie.split(';')
      cookieArray = cookieArray.filter((item) => item.includes(`${name}`))
      return cookieArray.length == 1 ? cookieArray[0].trim().replace(`${name}=`, '') : ''
    },

    delCookieByName(name) {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
      console.log(document.cookie)
    },

    // 取得產品列表  預設取第一頁資料
    getProduct(page = 1) {
      const url = `${baseUrl}/api/${path}/admin/products?page=${page}`
      axios
        .get(url)
        .then((res) => {
          if (res.data.success) {
            this.products = res.data.products
            this.pagination = res.data.pagination
          } else {
            console.log('無法取得商品')
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
     // 新增產品
     addProduct() {
      let propertyMap = {
        'title': '標題',
        'category': '分類',
        'unit': '單位',
        'origin_price': '原價',
        'price': '售價'
      };
      let checkObj = this.isValidProduct();
      if (!checkObj.isValid) {
        let hintItem = checkObj.lackItem.map((item) => {
          return propertyMap[item];
        }).join('、');
        alert(`資料不完整，${hintItem}為必填` );
        return;
      }
      productModal.hide();
      this.isLoading = !this.isLoading;
      const url = `${baseUrl}/api/${path}/admin/product`;
      axios.post(url, { data: this.tmpProduct })
        .then((res) => {
          if (res.data.success) {
            this.getProduct();
            this.isLoading = !this.isLoading;
            this.tmpProduct = {};
          } else {
            console.log(res.data);
          } 
        })
        .catch(error => {
          console.log(error);
        });
    },

    // check 欄位填寫 
    isValidProduct () {
      // title(String)、category(String)、unit(String)、origin_price(Number)、price(Number) 為必填欄位
      let requiredProperty = [ 'title', 'category', 'unit', 'origin_price', 'price' ];
      let checkProductObj = {
        isValid: true,
        lackItem: [],
      };
      requiredProperty.forEach((item) => {
        if ((!this.tmpProduct.hasOwnProperty(item)) || this.tmpProduct[ item ] === '') {
          checkProductObj.isValid = false;
          checkProductObj[ 'lackItem' ].push(item);
        }
      });
      return checkProductObj;
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
            this.tmpProduct = {};
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
              this.tmpProduct = {};
            }
          }).catch(error => {
            console.log(error);
          });
    },

    // 開啟產品 Modal 新增 / 編輯
    openModal(type, product = {}) {
      if (type === 'create') {
        this.modalTitle = '新增產品'
      } else {
        this.isNew = false
        this.modalTitle = '編輯產品'
        this.tmpProduct = { ...product }
      }
      productModal.show()
    },

    // 開啟確認刪除 Modal
    deleteModal(product) {
      this.tmpProduct = { ...product }
      delProductModal.show()
    },

    // 登出
    logout() {
      const url = `${baseUrl}/logout`
      axios
        .post(url)
        .then((res) => {
          if (res.data.success) {
            // 清 token
            axios.interceptors.request.use(function (config) {
              config.headers.Authorization = ''
              return config
            })
            // cookie 刪除
            this.delCookieByName('vue3Token')
            window.location = './login.html'
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
  },
})

// 分頁元件
app.component('pagination', {
  // template 屬性封裝
  template: `     
    <nav aria-label="Page navigation example">
      <ul class="pagination justify-content-center">
          <li class="page-item" v-bind:class="{ 'disabled': pagination.current_page === 1  }">
            <a class="page-link" href="#" tabindex="-1" @click="updatePages( pagination.current_page -1 )">Previous</a>
          </li>
          <li class="page-item"  v-for="(item, index) in pagination.total_pages" :key="index">
            <a class="page-link" href="#" @click="updatePages(item)">{{ item }}</a>
          </li>
          <li class="page-item" v-bind:class="{ 'disabled': pagination.current_page === pagination.total_pages  }">
            <a class="page-link" href="#" @click="updatePages(pagination.current_page +1 )">Next</a>
          </li>
      </ul>
    </nav>`,
  props: ['pagination'],
  methods: {
    // 向父元件 傳遞
    updatePages(page) {
      // $emit(觸發父元件的事件)
      this.$emit('update-pages', page)
    },
  },
})


app.mount('#app')
