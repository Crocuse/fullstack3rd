import axios from "axios";
import React, { useEffect, useState } from "react"
import { SERVER_URL } from "../../config/server_url";
import '../../css/Auction/CurrentList.css'

function CurrentList() {
    const [auctionProduct, setAuctionProduct] = useState([]);
    const [test, setTest] = useState([]);
    
    useEffect(()=> {
        //getTodayAuctionList();
        for(let i = 9; i<18; i++)
            setTest(prev=>[...prev, i]);
    }, [])
    
    async function getTodayAuctionProduct(grNo) {
        console.log('getTodayAuctionProduct()');
        const formData = new FormData();
        try{
            const response = await axios.get(`${SERVER_URL.SERVER_URL()}/auction/list_product?grNo=${grNo}`,);
            if(response.data == 'noProduct')
                alert('상품이 없습니다.');
            else{
                let product = response.data;
                setAuctionProduct(prevProduct => [...prevProduct, product]);
            }
        } catch(error) {
            console.log(error);
        }
    }
    
    async function getTodayAuctionList() {
        console.log('getTodayAuctionList()');
    
        try{
            const response = await axios.get(`${SERVER_URL.SERVER_URL()}/auction/current_list`);

            if(response.data == 'nolist')
                alert('오늘의 경매는 없습니다.');
            else{
                for(let i = 0; i < response.data.length; i++)
                    getTodayAuctionProduct(response.data[i].GR_NO);
            }
                
        } catch(error) {
            console.log(error);
        }
    }
    const sortProduct = () => {
        console.log(auctionProduct[0].GR_NO);
        console.log(auctionProduct[1].GR_NO);
    }

    const productBtnClickHandler = () => {
    }

    return (
        <div className="current_wrap">
            <table>
                <tbody>
                    {[...Array(3)].map((_, rowIdx) => (
                        <tr key={rowIdx}>
                            {[...Array(3)].map((_, colIdx) => {
                                const idx = rowIdx * 3 + colIdx;
                                return (
                                    <td key={colIdx} className="product">
                                    {idx < auctionProduct.length ? auctionProduct[idx] : ''}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
export default CurrentList;

// idx % 3 === 0 && idx !== 0 ?
                // <tr>
                //     <td className="product"> 
                //         <button type="button" onClick={productBtnClickHandler}>
                //             <img src={`${SERVER_URL.SERVER_URL()}/goodsImg/${product.imgs[0]}`} alt={product.GR_NAME} /> 
                //         </button><br />                 
                //         {product.GR_NAME}<br />
                //         {product.GR_PRICE} 원
                //     </td>
                // </tr>
                // :
                // <tr>
                //     <td className="product">
                //         <button type="button" onClick={productBtnClickHandler}>
                //             <img src={`${SERVER_URL.SERVER_URL()}/goodsImg/${product.imgs[0]}`} alt={product.GR_NAME} />   
                //         </button><br /> 
                //         {product.GR_NAME}<br />
                //         {product.GR_PRICE} 원
                //     </td>
                // </tr>