import React, { useState } from "react"

function Regist_form() {
    const [grName, setGrName] = useState('');
    const [grPrice, setGrPrice] = useState('');
    const [grInfo, setGrInfo] = useState('');
    
    const AuctionRegistBtnClickHandler = () => {
        console.log('AuctionRegistBtnClickHandler()');
        
    }

    const grNameChangeHandler = (e) => {
        setGrName(e.tartget.value); 
    }

    const grPriceChangeHandler = (e) => {
        setGrName(e.tartget.value); 
    }

    const grInfoChangeHandler = (e) => {
        setGrName(e.tartget.value); 
    }



    return (
        <article>
            <div>
                <form action="" method="" name="">
                <input type="text" name="gr_name" value={grName} onChange={(e) => grNameChangeHandler(e)}/>
                <input type="text" name="gr_price" value={grPrice} onChange={(e) => grPriceChangeHandler(e)}/>
                <input type="text" name="gr_info" value={grInfo} onChange={(e) => grInfoChangeHandler(e)}/>
                <input type="file" name="gr_img"/>
                <input type="button" value="Auction Regist" onClick={AuctionRegistBtnClickHandler} />
                </form>
            </div>    
        </article>

    );
}
export default Regist_form;
