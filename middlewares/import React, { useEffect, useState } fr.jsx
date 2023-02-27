import React, { useEffect, useState } from 'react'

const Untitled  = () => {
    const [products, setProducts] = useState([]);
    const getProducts = async () => {
        const products = await fetch('https://jsonplaceholder.typicode.com/posts');
        setProducts(products);
    };

    useEffect(() => {
        getProducts();
    },[products]);

  return (
    <div>
      {
        (()=>{
            if(products.length > 0){
                products.map((product,index) => {
                    <div className='card' key={index}>
                        <div className="card-body">
                            <h2>
                                {product.title}
                            </h2>
                            <h5>
                                {product.body}
                            </h5>
                        </div>
                    </div>
                });
            }else{
                <div className="text-center">
                    No products yet Posted
                </div>
            }
        })
      }
    </div>
  )
}

export default Untitled;
