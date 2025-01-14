
import styled from "styled-components";

export const Container = styled.div`
  width: 45vw;
  height: 98vh;
  display: flex;
  flex-direction: column;
  margin: auto;
  border: 3px solid;
  border-color: #FF796F;
  box-shadow: 5px 5px 3px #FF4848;
  border-radius: 1rem;
`

export const Logo = styled.img`
  width: 15vw;
  height: 12vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
`

export const ContentContainer = styled.div`
  width: 43vw;
  height: 75vh;
  display: flex;
  flex-direction: column;
  margin: auto;
`

export const Content = styled.div`
  width: 42.5vw;
  height: 8vh;
  display: flex;
  margin: 5px;
  border: 1px solid;
  background-color: #FFE5E5;
  border-radius: 8px;
`

export const Thumbnail = styled.img`
  width: 5vw;
  height: 8vh;
`

export const InfoContainer = styled.div`
  width: 41vw;
  height: 8vh;
  display: flex;
  justify-content: space-between;
`
export const Info = styled.div`
  width: 20vw;
  height: 8vh;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 5px;
`

export const Info1 = styled.div`
  width: 10vw;
  height: 8vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const ModalBackdrop = styled.div`
  position: absolute;
  top: 0%;
  left: 0%;
  bottom: 0%;
  right: 0%;
  background-color: rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ModalContainer = styled.div`
  width: 45vw;
  height: 60vh;
  display: flex;
  flex-direction: column;
  background-image: linear-gradient(#FFA29B, #FF4848, #FF7070);
  align-items: center;
  justify-content: center;
`

export const ModalImg = styled.img`
  width: 33vw;
  height: 50vh;
`

export const ModalClose = styled.button`
  width: 3vw;
  height: 5vh;
  margin-left: auto;
  border: 2px solid;
  border-color: white;
  background-color: transparent;
`

export const SearchContainer = styled.div`
  width: 43vw;
  height: 5vh;
  display: flex;
  justify-content: space-between;
  margin: auto;
`

export const Search = styled.input`
  width: 40vw;
  height: 5vh;
  border-radius: 8px;
  border: 1px solid;
  border-color: #FF4848;
`

export const Searchbtn = styled.button`
  width: 4vw;
  height: 5.7vh;
  border: 2px solid;
  border-color: #FF4848;
  font-size: 1.3rem;
  background-color: transparent;
  border-radius: 8px;
`
