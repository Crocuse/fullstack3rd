import axios from "axios";
import React, { useEffect, useState } from "react";
import { SERVER_URL } from "../../config/server_url";
import { useNavigate } from 'react-router-dom';
import '../../css/Auction/CurrentList.css';
import LoadingModal from "../include/LoadingModal";

function CurrentList() {
    const [auctionProduct, setAuctionProduct] = useState([]);
    const [loadingModalShow, setLoaingModalShow] = useState(false);
    const navigate = useNavigate();
    
    useEffect(()=> {
        setLoaingModalShow(true);
        getTodayAuctionList();
    }, []);
    
    async function getTodayAuctionProduct(grNo, location) {
        console.log('getTodayAuctionProduct()');
        try {
            const response = await axios.get(`${SERVER_URL.SERVER_URL()}/auction/list_product?grNo=${grNo}`);
            if(response.data === 'noProduct')
                alert('상품이 없습니다.');
            else {
                let product = response.data;
                const data = {
                    ...product,
                    location
                };
                setAuctionProduct(prevProduct => [...prevProduct, data].sort((a, b) => a.location - b.location));
                setLoaingModalShow(false);
            }
        } catch(error) {
            console.log(error);
        }
    }
    
    async function getTodayAuctionList() {
        console.log('getTodayAuctionList()');
        try {
            const response = await axios.get(`${SERVER_URL.SERVER_URL()}/auction/current_list`);
            if(response.data === 'nolist') {
                alert('오늘의 경매는 없습니다.');
                setLoaingModalShow(false);
                navigate('/');
            } else {
                for(let i = 0; i < response.data.length; i++) {
                    getTodayAuctionProduct(response.data[i].GR_NO, response.data[i].AS_LOCATION_NUM);
                }
            }
        } catch(error) {
            console.log(error);
            navigate();
        }
    }

    const productBtnClickHandler = (product) => {
        console.log('productBtnClickHandler()');
        navigate(`/auction/auction_page?grNo=${product.GR_NO}`);
    }

    const createEmptyCells = (count) => {
        const cells = [];
        for(let i = 0; i < count; i++) {
            cells.push(<td key={`empty-${i}`} className="product"></td>);
        }
        return cells;
    }

    const renderTableCells = () => {
        const cells = [];
        for (let i = 0; i < 9; i++) {
            if (i < auctionProduct.length) {
                const product = auctionProduct[i];
                const formattedPrice = Number(product.GR_PRICE).toLocaleString();
    
                cells.push(
                    <td key={i} className="product">
                        <button type="button" onClick={() => productBtnClickHandler(product)}>
                            <img src={`${SERVER_URL.SERVER_URL()}/goodsImg/${product.imgs[0]}`} alt={product.GR_NAME} />   
                        </button><br />
                        <strong>{product.GR_NAME}</strong><br />
                        <strong>시작가 {formattedPrice} 원</strong>
                    </td>
                );
            } else {
                cells.push(<td key={i} className="product"></td>);
            }
        }
        return cells;
    }
    const renderTableRows = () => {
        const rows = [];
        const cells = renderTableCells();
        for(let i = 0; i < cells.length; i += 3) {
            rows.push(<tr key={i}>{cells.slice(i, i + 3)}</tr>);
        }
        return rows;
    }

    return (
        <div className="current_wrap">
            <table>
                <tbody>
                    {renderTableRows()}
                </tbody>
            </table>
            {loadingModalShow === true ? <LoadingModal /> : null}
        </div>
    );
}

export default CurrentList;