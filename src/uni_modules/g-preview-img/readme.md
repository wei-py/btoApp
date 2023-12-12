![image](https://deaon-saasvideo.oss-cn-shanghai.aliyuncs.com/11111.gif)
### 一款兼容vue2，vue3的图片预览插件，视频预览，支持图片视频混用，支持单张多张，左右滑动，放大缩小

### 基础使用方法

```javascript
    <template>
    
        <image v-for="(item,idx) in imgList" :src="item" :key="idx" @tap="handleClick(idx)"></image>
        <g-preview-img :imgList="imgList" ref="preview"><g-preview-img>
    </template>
    
    <script setup>
        import { ref } from 'vue'
        const preview = ref(null)
        const imgList = ['图片路径1','图片路径2']
        const handleClick = (idx)=>{
            // idx为要打开的图片的索引，也可以不传，默认打开第一张
			// handlePreviewImg的参数支持传入单张图片地址或单个视频地址
            preview.value.handlePreviewImg(idx)
        }
    </script>
```

| 属性名/事件            | 类型           | 默认值                   | 说明                                                                                                                                                                                                 |
| ----------------- | ------------ | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| modeClass         | Array/String | \['fade', 'zoom-out'] | uni-transition组件过渡效果，可选值见 <https://uniapp.dcloud.net.cn/component/uniui/uni-transition.html#mode-class-%E5%86%85%E7%BD%AE%E8%BF%87%E6%B8%A1%E5%8A%A8%E7%94%BB%E7%B1%BB%E5%9E%8B%E8%AF%B4%E6%98%8E> |
| indicatorDotsType | Boolean      | false                 | 多张图片的指示器，ture为圆点，false数字，当图片列表只有一张图片时，默认不展示指示器                                                                                                                                                     |
| imgList           | Array        |                       | 图片列表                                                                                                                                                                                               |
| disabledScale     | Boolean      | false                 | 是否禁止双指放大缩小                                                                                                                                                            |
| @preview          | 打开关闭事件       |                       | 接受一个参数，ture为开启，false为关闭                                                                                                                                                                            |
| @changeImg        | 图片切换的事件      |                       | 参数为当前的图片索引                                                                                                                                                                                         |

#### 插槽，自定义翻页按钮

```js

<g-preview-img :imgList="imgList" ref="preview">
    <template>
        <!--你的翻页按钮-->
        <view @tap.stop="previousImg">上一页</view>
        <view @tap.stop="nextImg">下一页</view>
    </template>
</g-preview-img>

<script>
    const preview = ref(null)
    //上一页的方法
    const previousImg = ()=>{
        preview.value.previousImg()
    }
    //下一页的方法
    const previousImg = ()=>{
        preview.value.nextImg()
    }
</script>
```

#### 支持uniapp原生swiper的属性

    插件内部swiper标签上绑定了$attrs,所以在使用时可以传入一些swiper的属性
    注意：不要传disable-touch这个属性，会有意想不到的错误

**插件bug会及时修复！！**
