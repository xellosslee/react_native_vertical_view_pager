import _ from 'lodash';
import React, {Component} from 'react';
import {
    ScrollView
} from 'react-native';
import PropTypes from 'prop-types';

const SCROLL_THRESHOLD = 0.1;

/**
 * VerticalViewPager
 *
 * vertical view pager for both ios and android.
 *
 * This component only support vertical swipe. If want to use horizontal, use
 * some exists components like React Native's ScrollView or ViewPagerAndroid.
 *
 */
class VerticalViewPager extends Component {

  constructor(props) {
    super(props);

    this._scrolling = false;
    this._enableScrollTimer = null;
    this._layout = null;
    this._contentOffset = null;
  }

  onScrollBeginDrag(e) {
    // record starting points
    this._startContentOffset = e.nativeEvent.contentOffset;
    _.invoke(this.props, "onScrollBeginDrag", e);
  }
  
  onScrollEndDrag(e) {
    // calculate the offset the user scrolls
    this._movePosition(e.nativeEvent.contentOffset);
    _.invoke(this.props, 'onScrollEndDrag', e);
  }

  scrollTo({ x, y, animated }) {
    this.scrollview.scrollTo({ x, y, animated });
    this._contentOffset = { x: 0, y };
  }

  _movePosition(curOffset) {
    const {height} = this._layout;
    const {y: positionY} = curOffset;
    const {y: startY} = this._startContentOffset;
    const pageIdx = Math.round(positionY / height) <= 0 ? 0 : Math.round(positionY / height); // current page
    console.log(`layout height ${height} positionY ${positionY} math ${Math.round(positionY / height)} pageIdx ${pageIdx}`);

    // Swipe up
    if (startY > positionY && (pageIdx * height) - positionY > height * SCROLL_THRESHOLD) {
      console.log(`Scroll Up ${(pageIdx - 1) * height}`);
      this.scrollTo({y: (pageIdx - 1) * height, animated: true});
    }
    // Swipe down
    else if (startY < positionY && positionY - (pageIdx * height) > height * SCROLL_THRESHOLD) {
      console.log(`Scroll Down ${(pageIdx + 1) * height}`);
      this.scrollTo({y: (pageIdx + 1) * height, animated: true});
    }
    else {
      console.log(`Scroll Rollback ${pageIdx * height}`);
      this.scrollTo({y: pageIdx * height, animated: true}); // Rollback before position
    }
  }

  _refScrollView(scrollview) {
    this.scrollview = scrollview;
  }

  _onLayout(e) {
    this._layout = e.nativeEvent.layout;
  }

  onMomentumScrollEnd(e) {
    // Because onMomentumScrollEnd event is already be replace by onScroll event
    // that will event onMomentumScrollEnd if necassary.
    // Here define this event callback only avoid user to listen onMomentumScrollEnd
    // of native ScrollView that may cause troubles.
  }

  render() {
    const {
      contentContainerStyle,
      style
    } = this.props;
    return (
      <ScrollView
        {...this.props}
        ref={scrollview => this._refScrollView(scrollview)}
        onLayout={e => this._onLayout(e)}
        horizontal={false}
        style={style}
        scrollEnabled={true}
        onScrollBeginDrag={e => this.onScrollBeginDrag(e)}
        onScrollEndDrag={e => this.onScrollEndDrag(e)}
        onMomentumScrollEnd={e => this.onMomentumScrollEnd(e)}
        scrollEventThrottle={50}
        contentContainerStyle={contentContainerStyle}>
        {this.props.children}
      </ScrollView>
    )
  }
}

VerticalViewPager.propTypes = {
  // style of page container
  contentContainerStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number
  ]),
  contentOffset: PropTypes.object,
  // onScrollBeginDrag(nativeEvent)
  // a.k.a onScrollBegin
  onScrollBeginDrag: PropTypes.func,
  // onMomentumScrollEnd(nativeEvent)
  // nativeEvent.nativeEvent.contentOffset or nativeEvent.nativeEvent.position must exists
  // a.k.a onScrollEnd
  onMomentumScrollEnd: PropTypes.func,
  // onScrollEndDrag(nativeEvent)
  // nativeEvent.nativeEvent.contentOffset must exists
  // a.k.a. onScrollEndDrag
  onScrollEndDrag: PropTypes.func,
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number
  ])
};

export default VerticalViewPager;