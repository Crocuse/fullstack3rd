import React, { useState } from "react";
import $ from "jquery";
import '../../css/Auction/Regist_form.css'

function Regist_form() {
    const [grName, setGrName] = useState('');
    const [grPrice, setGrPrice] = useState('');
    const [grInfo, setGrInfo] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [img, setImg] = useState([]);
    const DragStartHandler = () => setIsActive(true);
    const DragEndHandler = () => setIsActive(false);
    
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

        let attach_file = $('input[name]');

    }

    const grNameChangeHandler = (e) => {
        console.log('grNameChangeHandler()');
        setGrName(e.target.value); 
    }

    const grPriceChangeHandler = (e) => {
        console.log('grPriceChangeHandler()');
        setGrPrice(e.target.value); 
    }

    const grInfoChangeHandler = (e) => {
        console.log('grInfoChangeHandler()');
        setGrInfo(e.target.value); 
    }

    const DropHandler = (e) => {
        console.log('DropHandler()');
        e.preventDefault();
        setIsActive(false);
        const file = e.dataTransfer.files[0];
        showAddImg(file);
    }    

    const uploadChangeHandler = (e) => {
        console.log('uploadHandler()');
        const file = e.target.files[0];
        showAddImg(file);
    };

    const showAddImg = (file) => {
        if(img.length > 4){
            alert('이미지는 5개 까지 올릴수 있습니다.');
            return;
        }

        if(file){
            const reader = new FileReader();
            reader.onload = () => {
                setImg([...img, reader.result]);

            };
            reader.readAsDataURL(file);
            
        }
    }

    const DragOverHandler = (e) => {
        e.preventDefault();
    }

    const deleteBtnHandler = (key) => {
        console.log(key);

        const tempImg = [...img];
        tempImg.splice(key, 1);
        setImg(tempImg);
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

                <label
                    className={`upload_area${isActive ? ' active' : ''}`}
                    onDragEnter={DragStartHandler}
                    onDragOver={DragOverHandler}
                    onDragLeave={DragEndHandler}
                    onDrop={DropHandler}
                >
                    <input type="file" className="gr_img" onChange={(e) => uploadChangeHandler(e)} />
                    {img.length !== 0 ? (
                        img.map((image, index) => (
                            <div key={index} className="img_angle">                                    
                                <img className="add_img" src={image} /><br/>
                                <button className="delete_btn" onClick={(key) => deleteBtnHandler(key)}><img src="/img/delete_FILL0_wght400_GRAD0_opsz24.png" alt="" /></button>      
                            </div>
                        ))
                    ) : (
                        <>
                            <div className="img_text" >
                                <p>클릭 혹은 파일을 이곳에 드롭 하세요.</p>
                                <p>파일당 최대 3MB, 최대 5개</p>
                            </div>
                            
                        </>
                    )}
                </label>
                <br/>

                <input type="button" value="Auction Regist" onClick={AuctionRegistBtnClickHandler} />
                <input type="reset" value="RESET"/>
                </form>
            </div>    
        </article>

    );
}
export default Regist_form;
