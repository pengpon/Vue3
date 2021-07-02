import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';
import products from './products.js';

createApp({
  data() {
    return {
      products
    }
  },
  methods: {
    // 更新產品
    updateProduct() {
      console.log('更新產品');
    },
    // popup
    openModal() {
      console.log('open');
    },
    deleteProduct() {
      console.log('del');
    },
    addImages() {
      console.log('新增圖片');
    }

    
  },
  mounted() {
    console.log('products', products);
    productModal = new bootstrap.Modal(document.getElementById('productModal'));
    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'));
    
  },

}).mount('#app');

console.log('rr');