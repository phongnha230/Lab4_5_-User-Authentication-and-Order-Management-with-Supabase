import React from 'react'
import ProductCart from "@/components/ui/ProductCart"

import iphone11 from "../assets/product/Iphone11_256G.png";
import iphone14 from "../assets/product/Iphone_14_128G.png";
import iphone15pro from "../assets/product/Iphone_15_pro_ 128G.png";
import iphone17pro from "../assets/product/Iphone_17_pro_Cam_1T.png";
import iphone11_hong from "../assets/product/Iphone_11_64G.png";
import iphone15Hong from "../assets/product/Ịphone15_Hong_128G.png";
import iphone13_128 from "../assets/product/Ịpone 13_128G.png";
import iphone15 from "../assets/product/Ipone_15_128G.png";
import iphone13 from "../assets/product/ipone13.png";
import Xs_max from "../assets/product/Xs_mas.png";

const Mock_product = [
    {
        id: 1,
        name: "Iphone 11",
        image: iphone11,
        description: "iphone 11 256G - Hàng Chính Hãng VN/A",
        price: "10.990.000đ",
    },

    {
        id:2,
        name: "Iphone 14",
        image: iphone14,
        description: "iphone 14 128- Hàng chính hãng VN/A",
        price: "16.099.000đ",
    },

    {
        id: 3,
        name: "Iphone 11 Hong",
        image: iphone11_hong,
        description: "Iphone 11 chinh hang tai VN/A",
        price: "10.999.000đ"
    },
    {
        id: 4,
        name: "Iphone 15 Hong",
        image: iphone15Hong,
        description: "Iphone 15 Hong chinh hang tai VN/A",
        price: "15.000.000đ",
    },
    
     {
        id: 5,
        name: "Iphone 17 Pro",
        image: iphone17pro,
        description: "Iphone 17 pro chinh hang tai VN/A",
        price: "30.000.000đ",
    },
     {
        id: 6,
        name: "Iphone 15 Pro",
        image: iphone15pro,
        description: "Iphone 15 pro chinh hang tai VN/A",
        price: "23.000.000đ",
    },
     {
        id: 7,
        name: "Iphone 13 128G",
        image: iphone13_128,
        description: "Iphone 13 chinh hang tai VN/A",
        price: "13.000.000đ",
    },
     {
        id: 8,
        name: "Iphone 15",
        image: iphone15,
        description: "Iphone 15 chinh hang tai VN/A",
        price: "14.000.000đ",
    },
     {
        id: 9,
        name: "Iphone 13",
        image: iphone13,
        description: "Iphone 13 chinh hang tai VN/A",
        price: "13.000.000đ",
    },
     {
        id: 10,
        name: "Iphone Xs Max",
        image: Xs_max,
        description: "Iphone Xs max chinh hang tai VN/A",
        price: "6.000.000đ",
     }
]
const HomePage = () => {
  return (
    <div className='bg-slate-50 min-h-[calc(100vh-80px)]'>
        <main className='max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 pt-8 lg:pt-12 pb-16'>
            <div className="flex items-center justify-between mb-8 md:mb-10">
              <h2 className='text-2xl md:text-3xl lg:text-4xl font-black text-slate-800 tracking-tight'>
                Sản phẩm nổi bật
              </h2>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8'>
                {Mock_product.map((product) => (
                    <ProductCart
                    key = {product.id}
                    id={product.id}
                    name={product.name}
                    image= {product.image}
                    description = {product.description}
                    price = {product.price}
                    />
                ))}
            </div>
        </main>
    </div>
  )
}

export default HomePage