<template>
  <view class="pos">
    <uni-transition :mode-class="modeClass" :show="show">
      <!-- 多张图片预览 -->
      <view class="content" @tap="closedPreview">
        <swiper
          class="swiper"
          circular
          :current="curDot"
          @change="swiperChange"
          :indicator-dots="false"
        >
          <swiper-item v-for="(item, idx) in selfImgList" :key="idx">
            <movable-area scale-area>
              <movable-view
                :scale="!disabledScale"
                direction="all"
                scale="true"
                scale-min="0.5"
                scale-max="5"
                :scale-value="1"
                damping="150"
                friction="15"
              >
                <image v-if="isImg(item)" :src="item" mode="widthFix"></image>
                <view class="video-preview" v-else>
                  <video
                    :autoplay="true"
                    :src="item"
                    :enable-progress-gesture="false"
                    :show-fullscreen-btn="false"
                  ></video>
                </view>
              </movable-view>
            </movable-area>
          </swiper-item>
        </swiper>
      </view>
      <!-- 指示器 -->
      <slot name="indicator" v-if="imgList.length > 1 && !indicatorDotsType">
        <view class="current-dot">
          <view class="change-buttom" @tap.stop="previousImg">
            <uni-icons class="font-white" type="back" size="30"></uni-icons>
          </view>
          <view class="font-white cur">
            {{ curDot + 1 }}/{{ imgList.length }}
          </view>
          <view class="change-buttom" @tap.stop="nextImg">
            <uni-icons class="font-white" type="forward" size="30"></uni-icons>
          </view>
        </view>
      </slot>
    </uni-transition>
  </view>
</template>
<script>
export default {
  props: {
    // 过渡效果
    modeClass: {
      type: Array,
      default: ['fade', 'zoom-out'],
    },
    // 指示器类型 true 圆点 false 数字
    indicatorDotsType: {
      type: Boolean,
      default: true,
    },
    // 图片列表
    imgList: {
      type: Array,
      default: () => [],
    },
    // 是否禁止放大缩小 禁止后swiper可以滑动切换
    disabledScale: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      show: false,
      curDot: 0,
      selfImgList: [],
    };
  },

  computed: {
    isImg() {
      return (src) => {
        return src.indexOf('.mp4') === -1 ? true : false;
      };
    },
  },
  watch: {
    //监听打开时阻止下面元素的滚动事件
    /*  #ifdef APP-PLUS*/
    show(val) {
      if (val) {
        document
          .getElementsByClassName('pos')[0]
          .addEventListener('touchmove', function (e) {
            e.preventDefault();
          });
      }
    },
    /* #endif */
    imgList: {
      handler(val) {
        if (val.length) {
          this.selfImgList = val.concat();
        }
      },
    },
  },
  methods: {
    handlePreviewImg(param) {
      this.show = !this.show;
      if (typeof param === 'string') {
        this.selfImgList = [param];
      } else {
        if (param) {
          this.curDot = param;
        }
      }
      this.$emit('preview', this.show);
    },
    closedPreview() {
      this.show = !this.show;
      this.curDot = 0;
      this.$emit('preview', this.show);
    },
    swiperChange(e) {
      this.curDot = e.detail.current;
      this.$emit('changeImg', e.detail.current);
    },
    previousImg() {
      let num = this.imgList.length - 1;
      if (this.curDot <= 0) {
        this.curDot = num;
      } else {
        this.curDot--;
      }
    },
    nextImg() {
      let num = this.imgList.length - 1;
      if (this.curDot >= num) {
        this.curDot = 0;
      } else {
        this.curDot++;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
movable-view {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

movable-area {
  height: 100%;
  width: 100%;
  position: fixed;
  overflow: hidden;
}

movable-view image {
  width: 100%;
}
.content {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  background: #00000076;
}
.pos {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999;
}
.swiper {
  height: 100%;
  width: 100%;
}
.current-dot {
  position: absolute;
  bottom: 10%;
  left: 25%;
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  .change-buttom {
    padding: 10rpx;
    border-radius: 50%;
    background: #3f3f3f;
  }
  .cur {
    font-size: 20rpx;
  }
}

.font-white {
  color: #fff !important;
}
::v-deep {
  .uni-swiper-dots-horizontal {
    bottom: 12%;
  }
  .uni-swiper-dot {
    width: 10rpx;
    height: 10rpx;
  }

  uni-video {
    width: 100vw;
    height: 100vh;
  }
}
.video-preview {
  position: relative;
  .video-close {
    position: absolute;
    right: 50rpx;
    top: 50rpx;
  }
}
</style>
