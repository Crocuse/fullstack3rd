import React from 'react';

const Test = () => {
    function checkBtn() {
        console.log('확인');
    }

    return (
        <>
            <button onClick={checkBtn}> 확인용 버튼 </button>
        </>
    );
};

export default Test;
