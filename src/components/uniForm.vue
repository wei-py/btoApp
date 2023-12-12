<template>
  <view class="border px-2 py-1 formClass">
    <wd-cell-group custom-class="!bg-black">
      <!---------------- 标题 👇 ---------------->
      <view
        v-if="props.title"
        class="h-[75rpx] flex items-center bg-[#ffab30] pl-[15px] text-white font-bold text-[30rpx] rounded-t sticky !top-0 z-10">
        {{ props.title }}
      </view>
      <!---------------- 插槽 title 👇 ---------------->
      <view class="sticky top-0 z-10">
        <slot name="title" />
      </view>

      <template v-for="formItem of form" :key="formItem.name">
        <!---------------- 文本 👇 ---------------->
        <wd-cell v-if="formItem.formType == 'text'" class="textClass" :class="formItem.name">
          <template #title>
            <view class="flex">
              <view v-if="formItem.required" class="w-[10rpx] text-red-600">*</view>
              <view v-else class="w-[10rpx]"></view>
              <view v-if="formItem.title" class="flex items-center">
                <wd-icon v-if="formItem.titleIcon" class="mr-1" :name="formItem.titleIcon" />
                <view>
                  {{ formItem.title }}
                </view>
              </view>
            </view>
          </template>
          <template #default>
            <view class="flex items-center justify-end w-full" @tap="voidFn(formItem, 'tap')">
              <slot :name="formItem.name + 'prefix'" />
              <wd-icon v-if="formItem.prefix" class="mr-1" :name="formItem.prefix" />
              <view class="!text-[20rpx] text-red-500 h-[10rpx] relative float">
                {{ get(formItem, 'errorTip') }}
              </view>
              <view :class="formItem.valueClass" :style="formItem.valueStyle">
                <view
                  v-if="formItem.value || isNumber(formItem.value)"
                  :class="get(formItem, 'disabled') ? 'disabled' : ''">
                  {{ getText(formItem) }}
                </view>
                <view v-else class="text-gray-400">
                  {{ formItem.placeholder }}
                </view>
              </view>

              <wd-icon v-if="formItem.suffix" class="ml-1" :name="formItem.suffix" />
              <slot :name="formItem.name + 'suffix'" />
              <!-- <wd-input v-bind="util.trimFormItem(formItem)" v-model="formItem.value" no-border :ref="formItem.name" /> -->
            </view>
          </template>
        </wd-cell>

        <!---------------- 输入框 👇 ---------------->
        <wd-cell v-if="formItem.formType == 'input'" class="inputClass" :class="formItem.name">
          <template #title>
            <view class="flex">
              <view v-if="formItem.required" class="w-[10rpx] text-red-600">*</view>
              <view v-else class="w-[10rpx]"></view>
              <view>
                {{ formItem.title }}
              </view>
            </view>
          </template>
          <template #default>
            <view class="flex items-center justify-end w-full">
              <slot :name="formItem.name + 'prefix'" />
              <wd-icon
                v-if="formItem.prefix"
                class="mr-1"
                :name="formItem.prefix"
                @tap="voidFn(formItem, 'prefixTap')" />
              <wd-input
                v-bind="util.trimFormItem(formItem)"
                v-model="formItem.value"
                no-border
                :ref="formItem.name"
                @input="(e) => voidFn(formItem, 'input', e)" />
              <wd-icon
                v-if="formItem.suffix"
                class="ml-1"
                :name="formItem.suffix"
                @tap="voidFn(formItem, 'suffixTap')" />
              <slot :name="formItem.name + 'suffix'" />
            </view>
            <view class="!text-[20rpx] text-red-500 h-[0rpx] relative top-[-50rpx]">
              {{ get(formItem, 'errorTip') }}
            </view>
          </template>
        </wd-cell>

        <!---------------- 时间选择器 👇 ---------------->
        <wd-cell v-if="formItem.formType == 'date'" class="dateClass" :class="formItem.name">
          <template #title>
            <view class="flex">
              <view v-if="formItem.required" class="w-[10rpx] text-red-600">*</view>
              <view v-else class="w-[10rpx]"></view>
              <view class="flex items-center h-full">
                {{ formItem.title }}
              </view>
            </view>
          </template>
          <template #default>
            <view class="flex items-center justify-end w-full">
              <wd-datetime-picker
                v-bind="formItem"
                v-model="formItem.value"
                @confirm="formItem.confirm(form._)" />
              <wd-icon class="ml-1 iconShow" name="add-circle" />
              <!-- <view class="!text-[20rpx] text-red-500 h-[0rpx] relative top-[-10rpx]">{{ get(formItem, 'errorTip') }}</view> -->
            </view>
          </template>
        </wd-cell>

        <!---------------- 选择器 滑轮 👇 ---------------->
        <wd-cell v-if="formItem.formType == 'select'" class="selectClass" :class="formItem.name">
          <template #title>
            <view class="flex">
              <view v-if="formItem.required" class="w-[10rpx] text-red-600">*</view>
              <view v-else class="w-[10rpx]"></view>
              <view class="flex items-center h-full">
                {{ formItem.title }}
              </view>
            </view>
          </template>
          <template #default>
            <view class="flex items-center justify-end">
              <slot :name="formItem.name + 'prefix'" />
              <wd-icon
                v-if="formItem.prefix"
                class="mr-1"
                :name="formItem.prefix"
                @tap="voidFn(formItem, 'prefixTap')" />
              <!-- 400 formItem.columns.length * 30 800 -->
              <wd-picker
                v-bind="util.trimFormItem(formItem)"
                :columns-height="util.limitNum(300, formItem.columns.length * 80, 600)"
                :columns="formItem.columns"
                label-key="label"
                value-key="value"
                v-model="formItem.value"
                @confirm="(e) => voidFn(formItem, 'confirm', e)"
                use-default-slot>
                <view class="flex justify-end">
                  <view v-if="formItem.value !== ''" :class="get(formItem, 'disabled') ? 'disabled' : ''">
                    {{
                      get(
                        find(formItem.columns, (n) => n.value === formItem.value),
                        'label'
                      )
                    }}
                    <!-- {{ formItem.value + 1 }} -->
                  </view>
                  <view v-if="formItem.value === ''" class="text-[#bfbfbf]">
                    {{ get(formItem, 'placeholder') || '请选择' }}
                  </view>
                  <wd-icon name="arrow-right" />
                </view>

                <view class="!text-[20rpx] text-red-500 h-[0rpx] relative top-[-10rpx]">
                  {{ get(formItem, 'errorTip') }}
                </view>
              </wd-picker>
              <wd-icon
                v-if="formItem.suffix"
                class="ml-1"
                :name="formItem.suffix"
                @tap="voidFn(formItem, 'suffixTap')" />
              <slot :name="formItem.name + 'suffix'" />
            </view>
          </template>
        </wd-cell>

        <!-- 选择器(多列选择) -->
        <wd-cell v-if="formItem.formType == 'mulitSelect'" class="inputClass" :class="formItem.name">
          <template #title>
            <view class="flex">
              <view v-if="formItem.required" class="w-[10rpx] text-red-600">*</view>
              <view v-else class="w-[10rpx]"></view>
              <view>
                {{ formItem.title }}
              </view>
            </view>
          </template>
          <template #default>
            <view class="flex items-center justify-end w-full">
              <slot :name="formItem.name + 'prefix'" />
              <wd-icon
                v-if="formItem.prefix"
                class="mr-1"
                :name="formItem.prefix"
                @tap="voidFn(formItem, 'prefixTap')" />
              <uniDataPicker
                v-bind="util.trimFormItem(formItem)"
                :readonly="formItem.disabled"
                :localdata="formItem.columns"
                @popupopened="(...e) => (formItem?.show ? formItem.show(...e) : () => {})"
                @change="
                  (e) => (formItem?.change ? formItem.change(e, props.root, formList) : (formItem.value = e.detail))
                " />
              <wd-icon name="arrow-right" />
              <wd-icon
                v-if="formItem.suffix"
                class="ml-1"
                :name="formItem.suffix"
                @tap="voidFn(formItem, 'suffixTap')" />
              <slot :name="formItem.name + 'suffix'" />
            </view>
            <view class="!text-[20rpx] text-red-500 h-[0rpx] relative top-[-50rpx]">
              {{ get(formItem, 'errorTip') }}
            </view>
          </template>
        </wd-cell>

        <!---------------- 多选选择器 👇 ---------------->
        <!---------------- 多级联动选择器 👇 ---------------->

        <!---------------- 开关 👇 ---------------->
        <!---------------- 文件 👇 ---------------->

        <!---------------- 图片 👇 ---------------->
        <!---------------- 插槽 👇 ---------------->
        <view v-if="formItem.formType == 'slot'">
          <wd-cell v-if="formItem.wdCell">
            <template #title>
              <view class="flex">
                <view v-if="formItem.required" class="w-[10rpx] text-red-600">*</view>
                <view v-else class="w-[10rpx]"></view>
                <view class="flex items-center h-full">
                  <slot :name="formItem.name + 'Title'" :scope="formItem"></slot>
                  <!-- {{ formItem.title }} -->
                </view>
              </view>
            </template>
            <slot :name="formItem.name + 'Value'" :scope="formItem"></slot>
          </wd-cell>
          <slot :name="formItem.name" :scope="formItem"></slot>
        </view>

        <!---------------- 开发时用来复制的代码 ---------------->
        <!---------------- <wd-cell v-if="formItem.formType == 'input'" class="inputClass">
          <template #title>
            <view class="flex">
              <view v-if="formItem.required" class="w-[10rpx] text-red-600">*</view>
              <view v-else class="w-[10rpx]"></view>
              <view>
                {{ formItem.title }}
              </view>
            </view>
          </template>
          <template #default>
            <view class="flex items-center justify-end">
              <wd-input v-bind="formItem" v-model="formItem.value" no-border />
              <wd-icon name="add-circle" />
            </view>
          </template>
        </wd-cell> ---------------->
      </template>
    </wd-cell-group>
  </view>
</template>

<script setup>
import { get, find, isNumber } from 'lodash'
import { util } from '@/utils/util'
// import { emit } from 'vue'
import uniDataPicker from '@/components/uni-data-picker/components/uni-data-picker/uni-data-picker.vue'
const props = defineProps({
  form: {}, // 表单源数据
  title: {}, // 标题
  titleClass: {} // 标题样式
})
const emit = defineEmits(['update:form'])
const form = useVModel(props, 'form', emit)

/**
 * @description 判断表单项是否有此方法
 * @param {*} formItem 表单项
 * @param {*} calllbackName 方法字段名
 */
const voidFn = (formItem, calllbackName, e) => {
  if (lo.isFunction(formItem[calllbackName])) {
    return formItem[calllbackName](e)
  } else {
    return () => {}
  }
}

/**
 * @description 区别有无 dictionary 显示 value
 * @param {*} formItem
 */
function getText(formItem) {
  const dictionary = lo.get(formItem, 'dictionary')
  const defaultValue = lo.get(dictionary, 'default')
  const value = lo.get(formItem, 'value')
  const dictionaryValue = lo.get(dictionary, value)
  return dictionaryValue || defaultValue || value
}

util.onceShow(() => {
  // console.log(form, 'uniForm 大组件')
})
</script>

<style scoped lang="scss">
// 所有表单项的属性
.disabled {
  color: #dbd9e0 !important;
}
.wd-icon {
  color: #ffab30 !important;
  @apply flex;
  @apply items-center;
}

//////////// 输入框的样式 ////////////
:deep(.inputClass) {
  .wd-input {
    @apply w-full;
  }
  .wd-input__inner {
    min-height: 30rpx !important;
  }
  .wd-input__placeholder {
    @apply text-gray-400;
  }

  input {
    @apply text-right;
  }

  .is-textarea {
    @apply w-[85%];
  }
}

//////////// 输入框的样式 ////////////

//////////// 选择框(滑轮)的样式 ////////////
:deep(.selectClass) {
  .wd-icon {
    // @apply hidden;
  }

  .iconShow {
    @apply block;
  }

  .wd-picker__field {
    @apply pr-[5rpx];
  }

  .wd-picker {
    @apply w-full;
  }
}

//////////// 选择框(滑轮)的样式 ////////////

//////////// 选择框(多列选择)的样式 ////////////
:deep(.uni-data-tree) {
  .selected-list {
    @apply justify-end;
  }
  .uniui-clear {
    @apply hidden;
  }
  .input-value-border {
    @apply border-0;
  }
  .selected-area {
    @apply justify-end;
  }
}
//////////// 选择框(多列选择)的样式 ////////////

// 默认表单的属性 只能穿透控制 🔈 别乱用 🈲
:deep(.wd-cell-group__body) {
  @apply bg-slate-200; // 圆角空白处的背景色

  .wd-cell {
    border-bottom: 1rpx solid #e6e6e6;
    @apply rounded-sm; // 最后一个表单项的圆角
    &:last-of-type {
      // border-bottom: 0;
      @apply rounded-b; // 最后一个表单项的圆角
    }
    .wd-picker__value {
      @apply p-0;
    }

    @apply p-0; // 左边标题的padding
    @apply w-full;

    .wd-cell__wrapper {
      @apply min-h-[70rpx]; // 统一高度
      @apply p-0; // 去除默认的边距
      @apply px-[15rpx]; // 统一表单项的padding
      // @apply py-[10rpx];
      @apply flex;
      @apply items-center;

      .wd-cell__left {
        @apply flex-auto;
        @apply w-[20%];
      }

      .wd-cell__right {
        @apply flex-auto;
        @apply w-[50%];
      }
    }
  }
}
</style>
