<div
  id="productModal"
  ref="productModal"
  class="modal fade"
  tabindex="-1"
  aria-labelledby="productModalLabel"
  aria-hidden="true"
>
  <div class="modal-dialog modal-m">
    <div class="modal-content border-0">
      <div class="modal-header bg-dark text-white">
        <h5 id="productModalLabel" class="modal-title">
          <span>{{ modalTitle }}</span>
        </h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="row">
          <!-- <div class="col-sm-4">
          <div class="mb-1">
            <div class="form-group">
              <label for="imageUrl">輸入圖片網址</label>
              <input type="text" class="form-control" placeholder="請輸入圖片連結" />
            </div>
            <img class="img-fluid" src="" alt="" />
          </div>
          <div>
            <button class="btn btn-outline-primary btn-sm d-block w-100">新增圖片</button>
          </div>
          <div v-else>
            <button class="btn btn-outline-danger btn-sm d-block w-100">刪除圖片</button>
          </div>
        </div> -->
          <div class="col-sm-12">
            <div class="form-group">
              <label for="title">標題</label>
              <span class="hint">(必填)</span>
              <input id="title" type="text" class="form-control" placeholder="請輸入標題" v-model="tmpProduct.title" />
            </div>

            <div class="row">
              <div class="form-group col-md-6">
                <label for="category">分類</label>
                <span class="hint">(必填)</span>
                <input
                  id="category"
                  type="text"
                  class="form-control"
                  placeholder="請輸入分類"
                  v-model="tmpProduct.category"
                />
              </div>
              <div class="form-group col-md-6">
                <label for="price">單位</label>
                <span class="hint">(必填)</span>
                <input id="unit" type="text" class="form-control" placeholder="請輸入單位" v-model="tmpProduct.unit" />
              </div>
            </div>

            <div class="row">
              <div class="form-group col-md-6">
                <label for="origin_price">原價</label>
                <span class="hint">(必填)</span>
                <!-- v-model.number 修飾符 字串轉數字 -->
                <input
                  id="origin_price"
                  type="number"
                  min="0"
                  class="form-control"
                  placeholder="請輸入原價"
                  v-model.number="tmpProduct['origin_price']"
                />
              </div>
              <div class="form-group col-md-6">
                <label for="price">售價</label>
                <span class="hint">(必填)</span>
                <input
                  id="price"
                  type="number"
                  min="0"
                  class="form-control"
                  placeholder="請輸入售價"
                  v-model.number="tmpProduct.price"
                />
              </div>
            </div>
            <hr />

            <div class="form-group">
              <label for="description">產品描述</label>
              <textarea
                id="description"
                type="text"
                class="form-control"
                placeholder="請輸入產品描述"
                v-model="tmpProduct.description"
              >
              </textarea>
            </div>
            <div class="form-group">
              <label for="content">說明內容</label>
              <textarea
                id="description"
                type="text"
                class="form-control"
                placeholder="請輸入說明內容"
                v-model="tmpProduct.content"
              >
              </textarea>
            </div>
            <div class="form-group">
              <div class="form-check">
                <input
                  id="is_enabled"
                  class="form-check-input"
                  type="checkbox"
                  :true-value="1"
                  :false-value="0"
                  v-model="tmpProduct.is_enabled"
                />
                <label class="form-check-label" for="is_enabled">是否啟用</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">取消</button>

        <button v-if="isNew" type="button" class="btn btn-primary" v-on:click="addProduct">確認新增</button>
        <button v-else type="button" class="btn btn-primary" v-on:click="editProduct">確認修改</button>
      </div>
    </div>
  </div>
</div>
