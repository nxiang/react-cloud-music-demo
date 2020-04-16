import React,{useEffect,useContext} from 'react'
import Horizen from '../../baseUI/horizen-item'
import { categoryTypes, alphaTypes } from '../../api/config'
import { NavContainer,ListContainer,List,ListItem } from './style'
import Scroll from '../../baseUI/scroll'
import  LazyLoad, {forceCheck} from 'react-lazyload';
import Loading from '../../baseUI/loading';
import { CategoryDataContext,CHANGE_ALPHA,CHANGE_CATEGORY } from './data'
import { 
  getSingerList,
  getHotSingerList,
  changeEnterLoading,
  changePageCount,
  changePullDownLoading,
  changePullUpLoading,
  refreshMoreHotSingerList,
  refreshMoreSingerList
} from './store/actionCreators'
import {connect} from 'react-redux'

function Singers(props) {
  // const [category, setCategory] = useState('')
  // const [alpha, setAlpha] = useState('')
  const { data, dispatch } = useContext(CategoryDataContext)
  const { category, alpha } = data.toJS()
  // console.log('Singers',data.toJS())
  const { singerList, enterLoading, pullUpLoading, pullDownLoading, pageCount } = props;

  const { getHotSingerDispatch, updateDispatch, pullDownRefreshDispatch, pullUpRefreshDispatch } = props;

  useEffect(() => {
    if(!singerList.size){
      getHotSingerDispatch();
    }
    // eslint-disable-next-line
  }, []);

  const handleUpdateCategory = (val)=>{
    // setCategory(val)
    dispatch({type:CHANGE_CATEGORY,data:val})
    updateDispatch(val, alpha);
  }
  
  const handleUpdateAlpha = (val)=>{
    // setAlpha(val)
    dispatch({type:CHANGE_ALPHA,data:val})
    updateDispatch(category, val);
  }

  const handlePullUp = () => {
    pullUpRefreshDispatch(category, alpha, category === '', pageCount);
  };

  const handlePullDown = () => {
    pullDownRefreshDispatch(category, alpha);
  };

  // 渲染函数，返回歌手列表
  const renderSingerList = () => {
    const list = singerList ? singerList.toJS(): [];
    return (
      <List>
        {
          list.map ((item, index) => {
            return (
              <ListItem key={item.accountId+""+index}>
                <div className="img_wrapper">
                  <LazyLoad placeholder={<img width="100%" height="100%" src={require('./singer.png')} alt="music"/>}>
                    <img src={`${item.picUrl}?param=300x300`} width="100%" height="100%" alt="music"/>
                  </LazyLoad>
                </div>
                <span className="name">{item.name}</span>
              </ListItem>
            )
          })
        }
      </List>
    )
  };
  return (
    <div>
      <NavContainer>
        <Horizen
          list={categoryTypes}
          handleClick={handleUpdateCategory}
          title={'分类 (默认热门):'} 
          oldVal={category}
          />
        <Horizen
          list={alphaTypes}
          handleClick={handleUpdateAlpha}
          title={'首字母:'}
          oldVal={alpha}
          />
      </NavContainer>
      <ListContainer>
        <Scroll
          pullUp={ handlePullUp }
          pullDown = { handlePullDown }
          pullUpLoading = { pullUpLoading }
          pullDownLoading = { pullDownLoading }
          onScroll={forceCheck}
        >
          { renderSingerList () }
        </Scroll>
        <Loading show={enterLoading}></Loading>
      </ListContainer>
    </div>
  )
}

const mapStateToProps = (state)=>({
  singerList:state.getIn(['singers','singerList']),
  enterLoading: state.getIn(['singers', 'enterLoading']),
  pullUpLoading: state.getIn(['singers', 'pullUpLoading']),
  pullDownLoading: state.getIn(['singers', 'pullDownLoading']),
  pageCount: state.getIn(['singers', 'pageCount'])
})

const mapDispatchToProps = (dispatch)=>{
  return {
    getHotSingerDispatch(){
      dispatch(getHotSingerList())
    },
    updateDispatch(category,alpha){
      dispatch(changePageCount(0))//由于改变了分类，所以pageCount清零
      dispatch(changeEnterLoading(true))//loading，现在实现控制逻辑，效果实现放到下一节，后面的loading同理
      dispatch(getSingerList(category,alpha))
    },
    // 滑到最底部刷新部分的处理
    pullUpRefreshDispatch(category,alpha,hot,count){
      dispatch(changePullUpLoading(true))
      dispatch(changePageCount(count+1))
      if(hot){
        dispatch(refreshMoreHotSingerList())
      }else{
        dispatch(refreshMoreSingerList(category,alpha))
      }
    },
    // 顶部下拉刷新
    pullDownRefreshDispatch(category,alpha){
      dispatch(changePullDownLoading(true))
      dispatch(changePageCount(0))
      if(category === '' && alpha === ''){
        dispatch(getHotSingerList())
      }else{
        dispatch(getSingerList(category,alpha))
      }
    }
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(React.memo(Singers))
