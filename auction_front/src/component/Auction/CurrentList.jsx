import axios from "axios";
import React, { useEffect, useState } from "react"
import { SERVER_URL } from "../../config/server_url";

function CurrentList() {
    const [auctionProduct, setAuctionProduct] = useState([]);
    
    useEffect(()=> {
        getTodayAuctionList();
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

                sortProduct();
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

    }
    return (
        <div className="current_wrap">
            <table>
                <tbody>
                    {auctionProduct.map((product, idx) => (
                        <tr>
                            <td><img src={`${SERVER_URL.SERVER_URL()}/goodsImg/${product.imgs[0]}`} alt="" /></td>
                            <td>{product.GR_NAME}</td>
                            <td>{product.GR_PRICE}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
export default CurrentList;