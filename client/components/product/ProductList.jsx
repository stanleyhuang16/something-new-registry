import React from "react";
import ProductCard from "./ProductCard";
import { v4 as uuidv4 } from "uuid";
import Cookies from "js-cookie";

const ProductList = ({ list, deleteProduct, buyProduct }) => {
  const isCouple = Cookies.get("ssid");
  console.log(Cookies.get());

  const productItems = list.map(
    ({
      product_name,
      image_url,
      store_name,
      lowest_daily_price,
      store_url,
      product_id,
      couple_id,
      date,
      on_hold, //toggled by "buyProduct"
      purchased, // toggled by "purchased"
    }) => {
      //wrap in Link for detail route, if so
      return (
        <ProductCard
          productId={product_id}
          key={uuidv4()}
          productName={product_name}
          imageUrl={image_url}
          storeName={store_name}
          productPrice={lowest_daily_price}
          deleteProduct={deleteProduct}
          buyProduct={buyProduct}
          storeUrl={store_url}
          date={date}
          isCouple={isCouple}
          coupleId={couple_id}
          onHold={on_hold}
          purchased={purchased}
        />
      );
    }
  );

  return <>{productItems}</>;
};

export default ProductList;
