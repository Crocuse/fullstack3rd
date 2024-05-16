import { useEffect, useState } from 'react';
import LoadingModal from '../include/LoadingModal';
import $, { param } from 'jquery';
import axios from 'axios';
import { SERVER_URL } from '../../config/server_url';
import '../../css/member/FindId.css';
import { useQuery } from '@tanstack/react-query';

const FindId = () => {
    // Hook **********
    const [mail, setMail] = useState('');

    // React Query **********
    const fetchId = async () => {
        const response = await axios.get(`${SERVER_URL.SERVER_URL()}/member/find_id`, { params: { mail } });
        return response.data;
    };

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['findId'],
        queryFn: fetchId,
        enabled: false,
    });

    useEffect(() => {
        findResponse();
    }, [data]);

    if (isLoading) return <LoadingModal />;
    if (isError) console.log(error.info?.message || 'failed to fetch');

    // Handler **********
    const mailChangeHandler = (e) => {
        setMail(e.target.value);
    };

    const findBtnClick = () => {
        if (!mail || mail == '') {
            $('.wrong').text('메일 주소를 입력해주세요.');
            return;
        }

        refetch();
        findResponse();
    };

    const pageCloseBtnClick = () => {
        window.close();
    };

    // Function **********
    const findResponse = () => {
        if (data === 'error') {
            alert('멤버 정보를 불러오는데 실패했습니다.');
            return;
        }

        if (data === 'not_found') {
            $('.wrong').text('가입된 메일 주소가 아닙니다.');
        } else if (data === 'google_id') {
            $('.wrong').html(`구글 계정으로 가입한 회원입니다. <br /> 구글 로그인을 통해 서비스를 이용해주세요.`);
        } else if (data === 'naver_id') {
            $('.wrong').html(`네이버 계정으로 가입한 회원입니다. <br /> 네이버 로그인을 통해 서비스를 이용해주세요.`);
        } else if (data === 'kakao_id') {
            $('.wrong').html(
                `카카오톡 계정으로 가입한 회원입니다. <br /> 카카오톡 로그인을 통해 서비스를 이용해주세요.`
            );
        } else if (data === 'mail_send') {
            $('.finded').css('display', 'block');
            $('.input_mail').css('display', 'none');
            $('.wrong').css('display', 'none');
            $('.find_btn').css('display', 'none');
        }
    };

    // View **********
    return (
        <div className="find_id_wrap">
            <div className="title">
                <h4>아이디 찾기</h4>
            </div>
            <div className="find">
                <div className="find_txt">회원가입시 등록한 메일 주소로 아이디가 발송됩니다.</div>
                <div className="input_mail">
                    <input
                        type="text"
                        name="m_mail"
                        placeholder="가입시 등록한 이메일을 입력해주세요."
                        onChange={mailChangeHandler}
                    />
                </div>
                <div className="wrong"></div>
                <div className="finded" style={{ display: 'none' }}>
                    <div className="find_txt">
                        아이디 정보가 메일로 전송됐습니다. <br /> 메일 수신까지 2 ~ 3분 소요될 수 있습니다.
                    </div>
                    <button onClick={pageCloseBtnClick}>창닫기</button>
                </div>
                <div className="find_btn">
                    <input type="button" value={'아이디 찾기'} onClick={findBtnClick} />
                </div>
            </div>
        </div>
    );
};

export default FindId;
