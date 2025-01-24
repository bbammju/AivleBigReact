import React, { useEffect, useState } from 'react';
import Mypage_Container from '../components/MyPage_Container'; //React 컴포넌트 이름은 대문자로 시작해야 정상적으로 렌더링
import api from '../utils/api';

function EditProfile() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    gender: '',
    address: '',
    zipcode: '',
    telno: ''
  });
  
  const [userSn] = useState(2); // 사용자 고유 번호(예: 1, 실제 데이터에 맞게 설정)

  // 사용자 정보를 가져오는 함수
  const fetchUserInfo = async () => {
    try {
      const response = await api.get(`/mypage?userSn=${userSn}`
      // , {
        // params: {
        //   userSn: userSn, // 백엔드 API에 필요한 사용자 고유 번호 전달
        // },
      // }
    );
      // 서버에서 받은 데이터를 상태에 설정
      const userInfo = response.data;
      setFormData({
        userSn: userSn,
        userName: userInfo.userName,
        email: userInfo.email,
        password: userInfo.password,  // 비밀번호는 일반적으로 클라이언트로 제공되지 않음
        gender: userInfo.gender,
        address: userInfo.address,
        zipCode: userInfo.zipCode,
        telno: userInfo.telno,
      });
    } catch (error) {
      console.error('사용자 정보를 가져오는 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    fetchUserInfo(); // 컴포넌트 로드 시 사용자 정보 가져오기
  }, []);

  // 입력 변경 핸들러
  const handleChange = (event) => {
    const { name, value } = event.target; // 이벤트로부터 name과 value 가져오기
    setFormData((prevFormData) => ({
      ...prevFormData, // 기존 상태를 복사
      [name]: value // 변경된 값 업데이트
    }));
  };

  // 수정 버튼 클릭 핸들러
  const handleUpdate = async () => {
    try {
      // const userSn = formData.userSn;
      console.log('전송할 데이터:', formData); // 전송 데이터 확인
      const response = await api.post(`/editprofile`,
        formData, { headers: {
      'Content-Type': 'application/json',} // json 타입으로 지정을 안해주면 spring에서 null로 받음
    });
      alert('수정된 내용을 저장했습니다.');
    } catch (error) {
      console.error('수정된 데이터를 저장하는 중 오류 발생:', error);
      alert('수정된 내용을 저장하는 데 실패했습니다.');
    }
  };

  const handleComplete = () => {
    console.log('수정완료 버튼 클릭:', formData);
    alert('수정을 완료했습니다.');
  };

  return (
    <div>
      <Mypage_Container
        onUpdate={handleUpdate}
        onComplete={handleComplete}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        formData={formData}
        handleChange={handleChange}
      />
    </div>
  );
}
export default EditProfile;