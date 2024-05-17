import React, { useEffect, useState, useRef } from "react";
import '../../css/Auction/RegistForm.css'
import axios from "axios";
import { SERVER_URL } from "../../config/server_url";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { sessionCheck } from "../../util/sessionCheck";

function RegistForm(props) {
    const [grName, setGrName] = useState('');
    const [grPrice, setGrPrice] = useState('');
    const [grInfo, setGrInfo] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [img, setImg] = useState([]);

    const [files, setFiles] = useState([]);

    const DragStartHandler = () => setIsActive(true);
    const DragEndHandler = () => setIsActive(false);

    const fileInputRef = useRef(null);

    const { modifyGoods, setShowModifyModal, isModify } = props;

    const sessionId = useSelector(state => state['loginedInfos']['loginedId']['sessionId']);
    const navigate = useNavigate();
    
    useEffect(() => {
        sessionCheck(sessionId, navigate);
        console.log(sessionId);
        console.log(isModify);
        console.log(modifyGoods);
        if (isModify && modifyGoods) {
            setGrName(modifyGoods.goods.GR_NAME);
            setGrPrice(modifyGoods.goods.GR_PRICE);
            setGrInfo(modifyGoods.goods.GR_INFO);
        }
        if (isModify && modifyGoods.images) {
            const initialImages = modifyGoods.images.map((image) => `C:\\acution\\goodsImg\\${image.GI_NAME}`);
            setImg(initialImages);
        }
    },[isModify,modifyGoods])

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

        let files = fileInputRef.current.files;
        console.log(files);

        const formData = new FormData();
        formData.append('grName', grName)
        formData.append('grPrice', grPrice)
        formData.append('grInfo', grInfo)

        if(isModify) formData.append('grNo',modifyGoods.goods.GR_NO);

        for(let i = 0; i<files.length; i++){
            console.log(files[i]);
            formData.append('gr_imgs', files[i]);
        }



        try{
            if(isModify) {
                const response = await axios.post(`${SERVER_URL.SERVER_URL()}/auction/modify_goods_confirm`, formData,{
                    headers: {
                        'Content-Type' : 'multipart/form-data'
                    }
                });
    
                if(response.data == 'success') {
                    alert('수정이 완료 되었습니다.');
                    props.setTemp(prev => !prev);
                } else {
                    alert('수정에 실패 했습니다.');
                    
                }
            } else {
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
        const newFiles = e.dataTransfer.files;
        showAddImg(files);
        setFiles(prevFiles => [...prevFiles, ...newFiles]);
    }    

    const uploadChangeHandler = (e) => {
        console.log('uploadHandler()');
        const newFiles = e.target.files;
        showAddImg(files);
        setFiles(prevFiles => [...prevFiles, ...newFiles]);
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

    const AuctionModifyBtnClickHandler = async () => {
        await postTransferFile();
        await setShowModifyModal(false);
        
    }

    const resetBtnClickHandler = () =>{
        if(isModify == undefined){
            setGrName('')
            setGrPrice('')
            setGrInfo('')
        } else if(isModify == true){
            setGrName(modifyGoods.goods.GR_NAME);
            setGrPrice(modifyGoods.goods.GR_PRICE);
            setGrInfo(modifyGoods.goods.GR_INFO);
        }
    }

    return (
        <article className="regist_form">
            <h1>{isModify ?'상품 수정' :'상품 등록'}</h1>
            <div>
                <form>
                <div className="regist_input_wrap">
                    <span className="regist_text">상품 이름 </span>
                    <input type="text" className="regist_input" name="gr_name" defaultValue={grName} onChange={(e) => grNameChangeHandler(e)}/> <br/><br/>
                    <span className="regist_text">희망 가격 </span>
                    <input type="number" className="regist_input" name="gr_price" defaultValue={grPrice} onChange={(e) => grPriceChangeHandler(e)}/> <br/><br/>
                    <span className="regist_text">간단한 설명 </span>
                    <input type="text" className="regist_input" name="gr_info" defaultValue={grInfo} onChange={(e) => grInfoChangeHandler(e)}/> <br/><br/>
                </div>
                <label
                    className={`upload_area${isActive ? ' active' : ''}`}
                    onDragEnter={DragStartHandler}
                    onDragOver={DragOverHandler}
                    onDragLeave={DragEndHandler}
                    onDrop={DropHandler}
                >
                    <input type="file" name="gr_imgs" className="gr_img" onChange={(e) => uploadChangeHandler(e)} multiple ref={fileInputRef}/>
                    {img.length !== 0 ? (
                        img.map((image, index) => (
                            <div key={index} className="img_angle">                                    
                                <img className="add_img" src={image} /><br/>
                                <button className="delete_btn" onClick={(e) => deleteBtnHandler(index, e)}><img src="/img/delete_FILL0_wght400_GRAD0_opsz24.png" /></button>      
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
                    <div className="regist_btn_wrap">
                        <input className="regist_btn" type="button" value={isModify==true ?"Auction Modify" : "Auction Regist"} 
                        onClick={isModify == true 
                            ? 
                          AuctionModifyBtnClickHandler 
                        : AuctionRegistBtnClickHandler} />
                        <input className="regist_btn" type="reset" value="RESET" onClick={resetBtnClickHandler}/>
                    </div>    
                </form>
            </div>    
        </article>

    );
}
export default RegistForm;
 