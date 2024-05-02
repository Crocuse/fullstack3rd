import React, { useEffect, useState } from "react";
import $ from "jquery";
import '../../css/Auction/RegistForm.css'
import axios from "axios";
import { SERVER_URL } from "../../config/server_url";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { sessionCheck } from "../../util/sessionCheck";

function RegistForm() {
    const [grName, setGrName] = useState('');
    const [grPrice, setGrPrice] = useState('');
    const [grInfo, setGrInfo] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [img, setImg] = useState([]);
    const DragStartHandler = () => setIsActive(true);
    const DragEndHandler = () => setIsActive(false);

    const sessionId = useSelector(state => state['loginedInfos']['loginedId']['sessionId']);
    const navigate = useNavigate();
    
    useEffect(() => {
        sessionCheck(sessionId, navigate);

        console.log(sessionId);
    })

    const AuctionRegistBtnClickHandler = () => {
        console.log('AuctionRegistBtnClickHandler()');

        if(grName === ''){
            alert('상품 이름을 입력 해주세요');
            return;
        } else if(grPrice === ''){
            alert('희망 가격을 입력 해주세요');
            return;
        } else if(grInfo === ''){
            alert('상품 설명을 입력 해주세요');
            return;
        }

        postTransferFile();
        
    }

    async function postTransferFile() {
        console.log('postTransferFile()');

        let gr_imgs = $('input[name="gr_imgs"]');
        let files = gr_imgs[0].files;

        const formData = new FormData();
        formData.append('grName', grName)
        formData.append('grPrice', grPrice)
        formData.append('grInfo', grInfo)

        for(let i = 0; i<img.length; i++){
            formData.append('gr_imgs', files[i]);
        }

        try{
            const response = await axios.post(`${SERVER_URL.SERVER_URL()}/auction/regist_form`, formData,{
                headers: {
                    'Content-Type' : 'multipart/form-data'
                }
            });

            if(response.data == 'success') {
                alert('등록이 완료 되었습니다.');
                navigate('/');
            } else {
                alert('등록에 실패 했습니다.');
                navigate('/auction/Regist_form');
            }
        } catch(error) {
            console.log(error);
        }
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
        const files = e.dataTransfer.files;
        showAddImg(files);
    }    

    const uploadChangeHandler = (e) => {
        console.log('uploadHandler()');
        
        const files = e.target.files;
        showAddImg(files);
    };

    const showAddImg = (files) => {
        console.log('showAddImg()');
        if(img.length  + files.length > 5){
            alert('이미지는 5개 까지 올릴수 있습니다.');
            return;
        }

        for(let i = 0; i < files.length; i++) {
            const reader = new FileReader();
            reader.onload = () => {
                setImg(prevImg => [...prevImg, reader.result]);
            };
            reader.readAsDataURL(files[i]);
        }
    }

    const DragOverHandler = (e) => {
        e.preventDefault();
    }

    const deleteBtnHandler = (index, e) => {
        console.log('deleteBtnHandler()');

        e.preventDefault();

        const tempImg = [...img];
        tempImg.splice(index, 1);
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
                    <input type="file" name="gr_imgs" className="gr_img" onChange={(e) => uploadChangeHandler(e)} multiple/>
                    {img.length !== 0 ? (
                        img.map((image, index) => (
                            <div key={index} className="img_angle">                                    
                                <img className="add_img" src={image} /><br/>
                                <button className="delete_btn" onClick={(e) => deleteBtnHandler(index, e)}><img src="/img/delete_FILL0_wght400_GRAD0_opsz24.png" alt="" /></button>      
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
export default RegistForm;
 