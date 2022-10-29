import { filter, map } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

const initialState = {
  isLoading: false,
  error: false,
  products: [],
  product: null,
  checkout: {
    cart: []
  }
};

const slice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET PRODUCTS
    getProductsSuccess(state, action) {
      state.isLoading = false;
      state.products = action.payload;
    },

    // GET PRODUCT
    getProductSuccess(state, action) {
      state.isLoading = false;
      state.product = action.payload;
    },

    // CHECKOUT
    getCart(state, action) {
      state.checkout.cart = action.payload;
    },

    addCart(state, action) {
      const product = action.payload;
      const isEmptyCart = state.checkout.cart.length === 0;

      if (isEmptyCart) {
        state.checkout.cart = [...state.checkout.cart, product];
      } else {
        const { length } = state.checkout.cart.filter(
          (p) => p.id === product.id && p.color === product.color && p.size === product.size
        );

        if (length === 0) state.checkout.cart = [...state.checkout.cart, product];
      }
    },

    deleteCart(state, action) {
      const { productId, size, color } = action.payload;

      state.checkout.cart = filter(
        state.checkout.cart,
        (item) => !(item.id === productId && item.size === size && item.color === color)
      );
    },

    resetCart(state) {
      state.checkout.activeStep = 0;
      state.checkout.cart = [];
    },

    increaseQuantity(state, action) {
      const { productId, size, color } = action.payload;

      state.checkout.cart = map(state.checkout.cart, (product) => {
        if (product.id === productId && product.size === size && product.color === color) {
          return {
            ...product,
            quantity: product.quantity + 1
          };
        }
        return product;
      });
    },

    decreaseQuantity(state, action) {
      const { productId, size, color } = action.payload;

      state.checkout.cart = map(state.checkout.cart, (product) => {
        if (product.id === productId && product.size === size && product.color === color) {
          return {
            ...product,
            quantity: product.quantity - 1
          };
        }
        return product;
      });
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { getCart, addCart, resetCart, deleteCart, createBilling, increaseQuantity, decreaseQuantity } =
  slice.actions;

export function getProducts() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/product/list');
      dispatch(slice.actions.getProductsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getProduct(productId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/product', { productId });
      dispatch(slice.actions.getProductSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}
