import axios from 'axios';
import React from 'react';
import { SERVER_URL } from '../config/server_url';

const Test = () => {
  const test = async () => {
    try {
      const response = await axios.get(`${SERVER_URL.SERVER_URL()}/admin/test`);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <button onClick={test}>확인용 버튼</button>
    </>
  );
};

export default Test;