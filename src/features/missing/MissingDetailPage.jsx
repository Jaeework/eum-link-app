import React,{useState, useEffect} from 'react'
import './MissingDetailPage.css'
import { useParams, useNavigate } from "react-router-dom"

import { Grid ,Box, Card ,Menu ,MenuItem } from '@mui/material';
import { EllipsisVertical ,MapPin ,Mars,Venus ,UserRoundSearch,HeartHandshake } from 'lucide-react';

import PostComment from '@/common/components/PostComment';
import PostMap from '@/common/components/PostMap';
import { useMissingPets } from '@/hooks/useMissingPets';
import { usePetSpecies } from '@/hooks/usePetSpecies';
import { useComments } from '@/hooks/useComment';
import useUserStore from '@/store/userStore';

const MissingDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useUserStore((state) => state.user);



  const { data, isLoading } = useMissingPets();
  const { data: species } = usePetSpecies();
  const { data: comments } = useComments('missing', id);

  // 게시글 메뉴
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {    setAnchorEl(event.currentTarget);  };
  const handleClose = () => {    setAnchorEl(null);  };
  if (isLoading) {    return <div>Loading...</div>;   }
  if (!data[id] || data[id].length === 0) {    return <div>Not Found</div>;  }

  const pet = data[id];
  const matchedSubSpecies = species[( pet.subSpecies)-1];

  const missingBtn = ()=>{    navigate("/missing");  };
  const myPageBtn = ()=>{    navigate("/mypage"); };
  const reportBtn = ()=>{
  };
  // 게시글 삭제
  async function deletepost() {
    console.log("id",pet?.id);
    const url = `http://localhost:5000/missingPets/${pet?.id}`; 
    try {
      const response = await fetch(url, {
        method: 'DELETE',
      });
      if (!response.ok) {
        console.error(`삭제 실패: ${response.status} - ${response.statusText}`);
        alert('데이터 삭제에 실패했습니다.');
        return;
      }
      console.log(`댓글 ID ${id} 삭제 성공!`);
      alert('데이터가 성공적으로 삭제되었습니다.');  
    } catch (error) {
      console.error('삭제 중 에러 발생:', error);
      alert('삭제 중 문제가 발생 !! 😭');
    }
    
  }
  const isMissingSwitch = async (pet) => {
    if (pet && typeof pet.isMissing === 'boolean') {
      const newIsMissingStatus = !pet.isMissing;
      console.log(`isMissing 상태를 ${pet.isMissing}에서 ${newIsMissingStatus}로 변경 시도...`);
      const url = `http://localhost:5000/missingPets/${pet?.id}`;
      try {
        const response = await fetch(url, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            isMissing: newIsMissingStatus
          })
        });
        if (!response.ok) {
          console.error(`서버 업데이트 실패 ㅠㅠ 상태 코드: ${response.status} - ${response.statusText}`);
          alert('상태 변경에 실패했습니다. 다시 시도해주세요.');
          return;
        }
        console.log(`게시물 ID ${pet.id}의 isMissing 상태를 ${newIsMissingStatus}로 서버 업데이트 성공!`);
        alert('상태가 성공적으로 변경되었습니다! ✨');
      } catch (error) {
        console.error('서버 업데이트 요청 중 에러 발생:', error);
        alert('상태 변경 중 예상치 못한 문제가 발생했어요!! 😭 네트워크 상태를 확인해보세요.');
      }
    }
  };
  
  
  return (
    <Grid  container spacing={0} sx={{padding:'0 4%', fontFamily:'Gmarket_light'}}>
      <Grid size={12} sx={{ width:'100%', maxHeight:'76vh', display:'flex' ,color:"#fff" ,fontFamily: 'KBO_medium'}}>
        <Box id='postnav' sx={{background:' #436850'}} onClick={missingBtn} >실종 신고</Box>
        <Box id='postnav' sx={{background:' #5D9471'}}>
          {pet?.petName} {pet?.isMissing === true? ( <UserRoundSearch  strokeWidth={2} />) 
          : ( <HeartHandshake  strokeWidth={2}/>) } </Box>
      </Grid>

      <Grid container size={12} >
        <Box id='post' sx={{width:'100%',height: '75vh',textAlign:'center',borderRadius:'0 20px 20px 20px', padding: '4vh 5vw'}}>
        <EllipsisVertical id='postmenu' onClick={handleClick} style={{ cursor: 'pointer' }} /> {/* 클릭 시 메뉴 열기 */}
          <Menu
            anchorEl={anchorEl} // 메뉴의 앵커 엘리먼트
            open={open} // 앵커가 존재할 때 메뉴 열기
            onClose={handleClose} // 메뉴 닫기
          >
            <MenuItem onClick={deletepost}>게시글 삭제 하기</MenuItem>
            <MenuItem onClick={isMissingSwitch}>실종 상태 변경</MenuItem>
          </Menu>
          {/* 정보카드 */}
          <Grid container size={12}  sx={{width:'100%',height:{xs:'85%',sm:'37vh'} , display:'flex'}} >
              {/* 사진 */}
              <Grid size={{ xs: 12, sm: 4}}>
                <Card sx={{ maxWidth:{xs:'200px',sm:'90%'}  ,height:{xs:'17vh',sm:'34vh'},borderRadius:'20px'}}>
                  <img style={{ width: '100%', height: '100%', objectFit: 'cover'}} src={pet?.imageUrl}/>
                </Card>
              </Grid>
              {/* 정보상세 */}
              <Grid container size={{ xs: 12, sm: 4}} id='d-text' 
              fontSize={{xs:'smaller',md:'medium'}}
              sx={{ maxWidth: '95%' ,maxHeight:{xs:'auto',sm:'34vh'}}} >
                <Grid container size={12} >
                  <h2>{pet?.petName} </h2> 
                  {pet?.isMissing === true 
                  ? "(실종됨)" : "(발견됨)"} 
                  <h3 style={{ marginLeft: 'auto'}}>{pet?.lostDate}</h3>
                  </Grid>
                <Grid container size={12} >
                  <h3>종</h3>   {matchedSubSpecies?.name}</Grid>
                <Grid container size={12}>
                  <h3>성별</h3> {pet?.petGender === "m" 
                  ? ( <div id='jender'><Mars strokeWidth={2} color='blue'/> <Venus strokeWidth={2.75} color='gray'/></div>)
                  : ( <div id='jender'><Mars strokeWidth={2} color='gray'/> <Venus strokeWidth={2.75} color='red'/></div>)}
                  {pet?.petGender === true ? "(중성화)" : "" }
                </Grid>
                <Grid container size={12}>
                  <h3>나이</h3> {pet?.age}살</Grid>
                <Grid container size={12}>
                  <h3>특징</h3> {pet?.description}</Grid>
              </Grid>
              {/* 지도 */}
              <Grid size={{ xs: 12, sm: 4}}>
                  <Card sx={{ width: '100%' ,height:{xs:'15vh',sm:'34vh'}, background:' #fff',borderRadius:'20px',boxShadow:'3px 3px 3px rgb(177, 177, 177)'}}>
                    <PostMap lostLocation={pet?.lostLocation || {}}/>
                    <Box id='loc' sx={{display:'flex', alignItems:'center',mt:1,marginLeft:'10px'}}>
                      <MapPin  strokeWidth={2.75} color='#436850'  />
                      <h3 >실종 당시 위치 </h3>{pet?.lostLocation.number_address}
                      </Box>
                  </Card>
              </Grid>
          </Grid>
          {/* 댓글 */}
          <Grid size={12}  sx={{width:'82vw',height:{sx:'',md:'32vh'},paddingBottom:'10px', background:' #fff',borderRadius:'20px',}}>
            <PostComment comments={comments || {}} postId={id} postType={'missing'}/>
          </Grid>

        </Box>
      </Grid>
      {/* 하단 버튼 */}
      {user?.id === pet.userId ? ( 
        <Grid id='bottombtn' size={12} sx={{ marginTop: '1vh', display: 'flex' }}
        onClick={myPageBtn}
        >
          <Box sx={{ maxHeight: '4vh' }}>
            실종 제보 보기
          </Box>
        </Grid>
      ) : (
        <Grid id='bottombtn' size={12} sx={{ marginTop: '1vh', display: 'flex' }}
        onClick={reportBtn}
        >
          <Box sx={{ maxHeight: '4vh' }}>
            제보하기
          </Box>
        </Grid>
      )}
    </Grid> 
  )
}

export default MissingDetailPage
