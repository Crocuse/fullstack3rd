import React, { useState } from "react";
import $ from "jquery";

function Regist_form() {
    const [grName, setGrName] = useState('');
    const [grPrice, setGrPrice] = useState('');
    const [grInfo, setGrInfo] = useState('');
    
    const AuctionRegistBtnClickHandler = () => {
        console.log('AuctionRegistBtnClickHandler()');

        if(grName === ''){
            alert('상품 이름을 입력 해주세요');
            return;
        } else if(grPrice === ''){
            alert('희망 가격을 입력 해주세요');
            return;
        } else if(grPrice === ''){
            alert('상품 설명을 입력 해주세요');
            return;
        }

        postTransferFile();
        
    }

    async function postTransferFile() {
        console.log('postTransferFile()');

        let attach_file = $('input[name]')
    }

    const grNameChangeHandler = (e) => {
        setGrName(e.target.value); 
    }

    const grPriceChangeHandler = (e) => {
        setGrPrice(e.target.value); 
    }

    const grInfoChangeHandler = (e) => {
        setGrInfo(e.target.value); 
    }



    return (
        <article>
            <div>
                <form action="" method="" name="">
                상품 이름 <br/>
                <input type="text" name="gr_name" value={grName} onChange={(e) => grNameChangeHandler(e)}/> <br/>
                희망 가격 <br/>
                <input type="number" name="gr_price" value={grPrice} onChange={(e) => grPriceChangeHandler(e)}/> <br/>
                간단한 설명 <br/>
                <input type="text" name="gr_info" value={grInfo} onChange={(e) => grInfoChangeHandler(e)}/> <br/>
                <input type="file" name="gr_img"/> <br/>
                <input type="button" value="Auction Regist" onClick={AuctionRegistBtnClickHandler} />
                <input type="reset" value="RESET"/>
                </form>
            </div>    
        </article>

    );
}
export default Regist_form;
