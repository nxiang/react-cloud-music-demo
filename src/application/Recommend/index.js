import React,{ useEffect } from 'react'
import Slider from '../../components/slider'
import { connect } from 'react-redux'
import * as actionTypes from './store/actionCreators'
import RecommendList from '../../components/list'
import Scroll from '../../baseUI/scroll'
import { Content } from './style'
import { forceCheck } from 'react-lazyload'
import Loading from '../../baseUI/loading'
import { renderRoutes } from 'react-router-config'

function Recommend(props) {
  const { bannerList,recommendList } = props
  const { getBannerDataDisPatch, getRecommendListDataDispatch,enterLoading } = props
  console.log('Recommend',props)
  useEffect(()=>{
    !bannerList.size && getBannerDataDisPatch()
    !recommendList.size && getRecommendListDataDispatch()
    // eslint-disable-next-line
  },[])
  const bannerListJS = bannerList ? bannerList.toJS():[]
  const recommendListJS = recommendList ? recommendList.toJS():[]
  return (
    <Content>
      <Scroll onScroll={forceCheck}>
        <div>
          <Slider bannerList={bannerListJS}></Slider>
          <RecommendList recommendList={recommendListJS}></RecommendList>
        </div>
      </Scroll>
      <Loading show={enterLoading}></Loading>
      {renderRoutes(props.route.routes)}
    </Content>
  )
}

// 映射 Redux 全局的 state 到组件的 props 上
const mapStateToProps = (state)=>({
  bannerList:state.getIn(['recommend','bannerList']),
  recommendList:state.getIn(['recommend','recommendList']),
  enterLoading:state.getIn(['recommend','enterLoading']),
})

// 映射 dispatch 到 props 上
const mapDispatchToProps = (dispatch)=>{
  return {
    getBannerDataDisPatch(){
      dispatch (actionTypes.getBannerList())
    },
    getRecommendListDataDispatch(){
      dispatch(actionTypes.getRecommendList())
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(React.memo(Recommend))
